import { db } from "@/lib/prisma";
import { getStreamClient } from "@/lib/stream";

export const BookingService = {
  /**
   * Retrieves an interviewer's public profile and availability.
   */
  async getInterviewerProfile(interviewerId) {
    try {
      const interviewer = await db.user.findUnique({
        where: { id: interviewerId, role: "INTERVIEWER" },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          title: true,
          company: true,
          yearsExp: true,
          bio: true,
          categories: true,
          creditRate: true,
          availabilities: {
            where: { status: "AVAILABLE" },
            select: { startTime: true, endTime: true },
            take: 1,
          },
          bookingsAsInterviewer: {
            where: { status: "SCHEDULED" },
            select: { startTime: true, endTime: true },
          },
        },
      });

      return interviewer ?? null;
    } catch (err) {
      console.error("BookingService.getInterviewerProfile error:", err);
      throw new Error("Failed to fetch interviewer profile");
    }
  },

  /**
   * Core logic to book a slot, generate a Stream call, and process credits.
   */
  async bookSlot(dbUser, interviewerId, startTime, endTime) {
    if (dbUser.role !== "INTERVIEWEE") {
      throw new Error("Only interviewees can book sessions");
    }

    const interviewer = await db.user.findUnique({ where: { id: interviewerId } });
    if (!interviewer || interviewer.role !== "INTERVIEWER") {
      throw new Error("Interviewer not found");
    }

    const credits = interviewer.creditRate ?? 10;

    if (dbUser.credits < credits) {
      throw new Error("Insufficient credits. Please upgrade your plan.");
    }

    // Check slot isn't already taken
    const conflict = await db.booking.findFirst({
      where: {
        interviewerId,
        status: "SCHEDULED",
        startTime: { lt: new Date(endTime) },
        endTime: { gt: new Date(startTime) },
      },
    });
    
    if (conflict) {
      throw new Error("This slot was just booked. Please pick another.");
    }

    // ── Create Stream call ─────────────────────────────────────────────────────
    let streamCallId;
    try {
      const streamClient = getStreamClient();

      await streamClient.upsertUsers([
        {
          id: dbUser.clerkUserId,
          name: dbUser.name ?? "Interviewee",
          image: dbUser.imageUrl ?? undefined,
          role: "user",
        },
        {
          id: interviewer.clerkUserId,
          name: interviewer.name ?? "Interviewer",
          image: interviewer.imageUrl ?? undefined,
          role: "user",
        },
      ]);

      streamCallId = `mock_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}`;

      const call = streamClient.video.call("default", streamCallId);

      await call.getOrCreate({
        data: {
          created_by_id: dbUser.clerkUserId,
          members: [
            { user_id: dbUser.clerkUserId, role: "host" },
            { user_id: interviewer.clerkUserId, role: "host" },
          ],
          settings_override: {
            recording: { mode: "available", quality: "1080p" },
            screensharing: { enabled: true },
            transcription: { mode: "auto-on" },
          },
        },
      });
    } catch (err) {
      console.error("Stream call creation failed:", err);
      throw new Error("Failed to create video call. Please try again.");
    }

    // ── Database Transaction ───────────────────────────────────────────────────
    try {
      const booking = await db.$transaction(async (tx) => {
        const newBooking = await tx.booking.create({
          data: {
            intervieweeId: dbUser.id,
            interviewerId,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            status: "SCHEDULED",
            creditsCharged: credits,
            streamCallId,
          },
        });

        await tx.creditTransaction.create({
          data: {
            userId: dbUser.id,
            amount: -credits,
            type: "BOOKING_DEDUCTION",
            bookingId: newBooking.id,
          },
        });

        await tx.user.update({
          where: { id: dbUser.id },
          data: { credits: { decrement: credits } },
        });
        
        await tx.user.update({
          where: { id: interviewerId },
          data: { creditBalance: { increment: credits } },
        });

        return newBooking;
      });

      return { success: true, bookingId: booking.id, streamCallId };
    } catch (err) {
      console.error("bookSlot transaction failed:", err);
      throw new Error("Booking transaction failed. Please try again.");
    }
  }
};
