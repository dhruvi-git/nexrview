"use server";

import { withAuth } from "@/lib/action-utils";
import { UserService } from "@/services/user.service";

export const getCurrentUser = withAuth(async ({ clerkUser }) => {
  return UserService.getCurrentUserProfile(clerkUser.id);
});
