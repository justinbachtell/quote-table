import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layouts/main-nav";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const { userId }: { userId: string | null } = auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <SignedIn>
          <MainNav items={siteConfig.mainNav} />
          <MobileNav items={siteConfig.mainNav} />
        </SignedIn>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            {!userId && (
              <SignInButton>
                <Button>
                  Sign in
                  <span className="sr-only">Sign in</span>
                </Button>
              </SignInButton>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
