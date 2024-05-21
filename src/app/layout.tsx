import React from "react";
import { env } from "@/env.js";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";

import { siteConfig } from "@/config/site";

import { ThemeProvider } from "@/components/providers";

import { Toaster } from "@/components/ui/sonner";
import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import { absoluteUrl, cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "react server components",
    "quotes",
    "quotes api",
    "quotes generator",
    "quotes app",
    "books",
    "authors",
    "quotes by authors",
    "quotes in books",
    "quotes from books",
    "quotes from authors",
    "books by authors",
    "authors of books",
    "books with quotes",
    "authors with quotes",
    "books by publishers",
  ],
  authors: [
    {
      name: "Justin Bachtell",
      url: "https://justinbachtell.com/",
    },
  ],
  creator: "Justin Bachtell",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@justinjbachtell",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: absoluteUrl("/site.webmanifest"),
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const user = await currentUser();

  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
              fontSans.variable,
              fontMono.variable,
              fontHeading.variable,
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider cookies={cookies().toString()}>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader user={user} />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                </div>
              </TRPCReactProvider>
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
