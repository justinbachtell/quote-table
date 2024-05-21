import { type UserRole } from "@/types";
import { authMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: [
    "/",
    "/signin(.*)",
    "/signup(.*)",
    "/sso-callback(.*)",
    "/api(.*)",
  ],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      //  For public routes, we don't need to do anything
      return NextResponse.next();
    }

    const url = new URL(req.nextUrl.origin);

    if (!auth.userId) {
      //  If user tries to access a private route without being authenticated,
      //  redirect them to the sign in page
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    // If the user doesn't have a role, set it to user
    if (!auth.user?.privateMetadata?.role) {
      await clerkClient.users.updateUserMetadata(auth.userId, {
        privateMetadata: {
          role: "user" satisfies UserRole,
        },
      });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
