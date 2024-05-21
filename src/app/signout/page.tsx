import type { Metadata } from "next";
import { env } from "@/env.js";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { LogOutButtons } from "@/components/auth/logout-buttons";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign out",
  description: "Sign out of your account",
};

export default function SignOutPage() {
  return (
    <Shell className="max-w-md">
      <PageHeader className="text-center">
        <PageHeaderHeading size="sm">Sign out</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Are you sure you want to sign out?
        </PageHeaderDescription>
      </PageHeader>
      <LogOutButtons />
    </Shell>
  );
}
