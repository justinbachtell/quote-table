import { env } from "@/env";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Set public routes
const isPublicRoute = createRouteMatcher(["/", "/api(.*)", "/api/trpc(.*)"]);

// Set the necessary options for a satellite application
const options = {
  isSatellite: false,
  signInUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  domain: env.NEXT_PUBLIC_CLERK_DOMAIN,
};

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
}, /* {debug: true } */ options);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
