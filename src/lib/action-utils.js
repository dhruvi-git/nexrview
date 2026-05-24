import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { checkRateLimit } from "@/lib/arcjet";

/**
 * Higher-order function to wrap server actions with standard authentication and error handling.
 * 
 * @param {Function} handler - The business logic handler to execute
 * @param {Object} options - Options for the wrapper
 * @param {string} [options.requiredRole] - If specified, restricts access to "INTERVIEWER" or "INTERVIEWEE"
 * @param {Object} [options.rateLimiter] - If specified, applies Arcjet rate limiting
 * @returns {Function} - The wrapped server action
 */
export const withAuth = (handler, options = {}) => {
  return async (...args) => {
    try {
      // 1. Authenticate user
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error("Unauthorized: Please log in to perform this action.");
      }

      // 2. Apply rate limiting if requested
      if (options.rateLimiter) {
        const req = await request();
        const rateLimitError = await checkRateLimit(options.rateLimiter, req, clerkUser.id);
        if (rateLimitError) {
          throw new Error(`Rate limit exceeded: ${rateLimitError}`);
        }
      }

      // 3. Fetch database user
      const dbUser = await db.user.findUnique({
        where: { clerkUserId: clerkUser.id },
      });

      if (!dbUser) {
        throw new Error("User profile not found in database.");
      }

      // 4. Role-based authorization
      if (options.requiredRole && dbUser.role !== options.requiredRole) {
        throw new Error(`Forbidden: Requires ${options.requiredRole} access.`);
      }

      // 5. Execute handler with injected user context
      return await handler({ clerkUser, dbUser, args });
    } catch (error) {
      console.error("Action error:", error);
      // Ensure we only throw standard Error objects or return standard error shapes
      throw new Error(error.message || "An unexpected error occurred.");
    }
  };
};
