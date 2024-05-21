import Link from "next/link";
import * as React from "react";

import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { type getGithubStars } from "@/lib/actions/github";

import { Icons } from "@/components/icons";

interface HeroProps {
  githubStarsPromise: ReturnType<typeof getGithubStars>;
}

export async function Hero({ githubStarsPromise }: HeroProps) {
  const githubStars = Promise.resolve(githubStarsPromise);

  return (
    <Shell>
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-16 text-center">
        <div
          className="flex animate-fade-up flex-col space-y-2"
          style={{ animationDelay: "0.10s", animationFillMode: "both" }}
        >
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Badge
              aria-hidden="true"
              className="rounded-full px-3.5 py-1.5"
              variant="secondary"
            >
              <Icons.github className="mr-2 size-3.5" aria-hidden="true" />
              {githubStars} stars on GitHub
            </Badge>
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
        <h1
          className="animate-fade-up text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.20s", animationFillMode: "both" }}
        >
          Store and access your book quotes online
        </h1>
        <p
          className="max-w-2xl animate-fade-up text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.30s", animationFillMode: "both" }}
        >
          Save and search your favorite quotes by quote, author, book,
          publisher, genre, topic, and more.
        </p>
      </section>
    </Shell>
  );
}
