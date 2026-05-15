"use server";

import { revalidatePath } from "next/cache";
import { createRateLimiter } from "@/lib/arcjet";
import { withAuth } from "@/lib/action-utils";
import { BookingService } from "@/services/booking.service";

// 5 booking attempts per hour — generous enough for real users,
// tight enough to block automated abuse
const bookingLimiter = createRateLimiter({
  refillRate: 2,
  interval: "1h",
  capacity: 5,
});

export const getInterviewerProfile = async (interviewerId) => {
  // Public facing, doesn't need auth wrapper
  return BookingService.getInterviewerProfile(interviewerId);
};

export const bookSlot = withAuth(
  async ({ dbUser, args: [params] }) => {
    const { interviewerId, startTime, endTime } = params;
    
    const result = await BookingService.bookSlot(
      dbUser,
      interviewerId,
      startTime,
      endTime
    );

    revalidatePath(`/interviewers/${interviewerId}`);
    revalidatePath("/dashboard");

    return result;
  },
  { rateLimiter: bookingLimiter }
);
