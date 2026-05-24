import { db } from "@/lib/prisma";

export const UserService = {
  /**
   * Fetches the current user profile from the database based on Clerk ID.
   */
  async getCurrentUserProfile(clerkUserId) {
    if (!clerkUserId) return null;
    return db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        role: true,
        name: true,
        title: true,
        company: true,
        imageUrl: true,
        creditBalance: true,
      },
    });
  },

  /**
   * Updates or creates availability for an interviewer.
   */
  async setAvailability(dbUserId, startTime, endTime) {
    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error("Start time must be before end time");
    }

    const existing = await db.availability.findFirst({
      where: { interviewerId: dbUserId, status: "AVAILABLE" },
    });

    if (existing) {
      await db.availability.update({
        where: { id: existing.id },
        data: { startTime: new Date(startTime), endTime: new Date(endTime) },
      });
    } else {
      await db.availability.create({
        data: {
          interviewerId: dbUserId,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "AVAILABLE",
        },
      });
    }
  },

  /**
   * Gets the current available slot for an interviewer.
   */
  async getAvailability(dbUserId) {
    return db.availability.findFirst({
      where: { interviewerId: dbUserId, status: "AVAILABLE" },
    });
  },

  /**
   * Gets earnings and completion stats for an interviewer.
   */
  async getInterviewerStats(dbUserId) {
    const dbUser = await db.user.findUnique({
      where: { id: dbUserId },
      select: {
        creditBalance: true,
        creditRate: true,
        bookingsAsInterviewer: {
          where: { status: "COMPLETED" },
          select: { creditsCharged: true },
        },
      },
    });

    if (!dbUser) throw new Error("User not found");

    const totalEarned = dbUser.bookingsAsInterviewer.reduce(
      (sum, b) => sum + b.creditsCharged,
      0
    );

    return {
      creditBalance: dbUser.creditBalance,
      creditRate: dbUser.creditRate,
      totalEarned,
      completedSessions: dbUser.bookingsAsInterviewer.length,
    };
  },
};
