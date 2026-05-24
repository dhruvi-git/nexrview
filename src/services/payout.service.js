import { db } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { WithdrawalRequestEmail } from "@/emails/WithdrawalRequestEmail";
import { render } from "@react-email/render";

const ADMIN_EMAIL = "piyushagarwalvo@gmail.com";
const PLATFORM_FEE = 0.2;

export const PayoutService = {
  /**
   * Processes a withdrawal request, calculates fees, updates DB, and notifies admin.
   */
  async requestWithdrawal(dbUser, credits, paymentMethod, paymentDetail) {
    if (dbUser.role !== "INTERVIEWER") throw new Error("Forbidden: Only interviewers can withdraw.");
    if (!credits || credits <= 0) throw new Error("Invalid credit amount");
    if (credits > dbUser.creditBalance) throw new Error("Insufficient credit balance");
    if (!paymentMethod || !paymentDetail) throw new Error("Payment details required");

    const netAmount = credits * (1 - PLATFORM_FEE) * 5;
    const platformFee = credits * PLATFORM_FEE * 5;

    try {
      const [payout] = await db.$transaction([
        db.payout.create({
          data: {
            interviewerId: dbUser.id,
            credits,
            platformFee,
            netAmount,
            paymentMethod,
            paymentDetail,
            status: "PROCESSING",
          },
        }),
        db.user.update({
          where: { id: dbUser.id },
          data: { creditBalance: { decrement: credits } },
        }),
      ]);

      // Fire admin email — non-blocking
      try {
        const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payout/${payout.id}`;
        const html = await render(
          WithdrawalRequestEmail({
            interviewerName: dbUser.name ?? "Unknown",
            interviewerEmail: dbUser.email,
            credits,
            platformFee,
            netAmount,
            paymentMethod,
            paymentDetail,
            reviewUrl,
          })
        );
        
        await resend.emails.send({
          from: "Nexrview <onboarding@resend.dev>",
          to: ADMIN_EMAIL,
          subject: `Withdrawal Request — ${dbUser.name} · ${credits} credits`,
          html,
        });
      } catch (emailErr) {
        console.error("Withdrawal email failed:", emailErr);
      }

      return { success: true, netAmount };
    } catch (err) {
      console.error(err);
      throw new Error("Withdrawal request failed");
    }
  },

  /**
   * Retrieves withdrawal history for an interviewer.
   */
  async getWithdrawalHistory(dbUserId) {
    return db.payout.findMany({
      where: { interviewerId: dbUserId },
      orderBy: { createdAt: "desc" },
    });
  }
};
