import { type UserRole } from "@/types";
import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { env } from "@/env";

/* // Set the necessary options for a satellite application
const options = {
  isSatellite: true,
  signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  domain: env.NEXT_PUBLIC_CLERK_DOMAIN,
}; */

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: ["/", "/api(.*)", "/api/trpc(.*)"],

  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      // For public routes, we don't need to do anything
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);

    // handle users who aren't authenticated
    if (!auth.userId) {
      return redirectToSignIn({
        returnBackUrl: req.url,
      });
    }

    // If the user doesn't have a role, set it to user
    if (auth.userId && !auth.user?.privateMetadata?.role) {
      await clerkClient.users.updateUserMetadata(auth.userId, {
        privateMetadata: {
          role: "user" satisfies UserRole,
        },
      });
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};