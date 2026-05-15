"use server";

import { revalidatePath } from "next/cache";
import { createRateLimiter } from "@/lib/arcjet";
import { withAuth } from "@/lib/action-utils";
import { UserService } from "@/services/user.service";
import { PayoutService } from "@/services/payout.service";
import { db } from "@/lib/prisma"; // needed for appointments until we create a booking service method

const withdrawalLimiter = createRateLimiter({
  refillRate: 1,
  interval: "1h",
  capacity: 3,
});

// ─── AVAILABILITY ─────────────────────────────────────────────────────────────

export const setAvailability = withAuth(
  async ({ dbUser, args: [params] }) => {
    const { startTime, endTime } = params;
    await UserService.setAvailability(dbUser.id, startTime, endTime);
    revalidatePath("/dashboard");
    return { success: true };
  },
  { requiredRole: "INTERVIEWER" }
);

export const getAvailability = withAuth(async ({ dbUser }) => {
  return UserService.getAvailability(dbUser.id);
});

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

export const getInterviewerAppointments = withAuth(async ({ dbUser }) => {
  // Ideally this could also move to BookingService, but keeping here for simplicity for now
  return db.booking.findMany({
    where: { interviewerId: dbUser.id },
    include: {
      interviewee: { select: { name: true, imageUrl: true, email: true } },
      feedback: true,
    },
    orderBy: { startTime: "desc" },
  });
});

// ─── EARNINGS / WITHDRAWAL ────────────────────────────────────────────────────

export const getInterviewerStats = withAuth(async ({ dbUser }) => {
  return UserService.getInterviewerStats(dbUser.id);
});

export const requestWithdrawal = withAuth(
  async ({ dbUser, args: [params] }) => {
    const { credits, paymentMethod, paymentDetail } = params;
    const result = await PayoutService.requestWithdrawal(
      dbUser,
      credits,
      paymentMethod,
      paymentDetail
    );
    revalidatePath("/dashboard");
    return result;
  },
  { requiredRole: "INTERVIEWER", rateLimiter: withdrawalLimiter }
);

export const getWithdrawalHistory = withAuth(async ({ dbUser }) => {
  return PayoutService.getWithdrawalHistory(dbUser.id);
});
