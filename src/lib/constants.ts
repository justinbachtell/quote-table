export const unknownError =
  "An unknown error occurred. Please try again later.";

export const redirects = {
  toLogin: "/sign-in",
  toSignup: "/sign-up",
  afterLogin: "/dashboard",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/dashboard",
} as const;

export const dbPrefix = "quote-table";
