import { env } from "@/env";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Set public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api(.*)",
]);

// Set the necessary options for a satellite application
const options = {
  isSatellite: false,
  signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  domain: env.NEXT_PUBLIC_CLERK_DOMAIN,
};

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return; // if it's a public route, do nothing
  auth().protect(); // for any other route, require auth
}, options);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};