import { type HandleOAuthCallbackParams } from "@clerk/types";

import { Shell } from "@/components/shell";
import { SSOCallback } from "@/components/auth/sso-callback";

export interface SSOCallbackPageProps {
  searchParams: HandleOAuthCallbackParams;
}

export default function SSOCallbackPage({
  searchParams,
}: SSOCallbackPageProps) {
  return (
    <Shell className="max-w-lg">
      <SSOCallback searchParams={searchParams} />
    </Shell>
  );
}
