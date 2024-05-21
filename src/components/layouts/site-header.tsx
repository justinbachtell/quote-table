import Link from "next/link";
import type { User } from "@clerk/nextjs/server";

import { Icons } from "@/components/icons";
import { AuthDropdown } from "@/components/auth/auth-dropdown";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layouts/main-nav";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { siteConfig } from "@/config/site";

interface SiteHeaderProps {
  user: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="hidden gap-6 lg:flex">
          <Link href="/" className="hidden items-center space-x-2 lg:flex">
            <Icons.logo className="size-8" aria-hidden="true" />
            <span className="hidden font-bold lg:inline-block">
              {siteConfig.name}
            </span>
            <span className="sr-only">Home</span>
          </Link>
          <SignedIn>
            <MainNav items={siteConfig.mainNav} />
            <MobileNav items={siteConfig.mainNav} />
          </SignedIn>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
