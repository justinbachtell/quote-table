import * as React from "react";

import { getGithubStars } from "@/lib/actions/github";

import { Hero } from "@/components/layouts/hero";
import { Main } from "@/components/layouts/main";
import { HeroSkeleton } from "@/components/layouts/hero-skeleton";
import { MainSkeleton } from "@/components/layouts/main-skeleton";
import { Separator } from "@/components/ui/separator";

export default function IndexPage() {
  /**
   * To avoid sequential waterfall requests, multiple promises are passed to fetch data parallelly.
   * These promises are also passed to the `Main` component, making them hot promises. This means they can execute without being awaited, further preventing sequential requests.
   * @see https://www.youtube.com/shorts/A7GGjutZxrs
   * @see https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
   */
  const githubStarsPromise = getGithubStars();

  return (
    <>
      <React.Suspense fallback={<HeroSkeleton />}>
        <Hero githubStarsPromise={githubStarsPromise} />
      </React.Suspense>
      <Separator
        className="animate-fade-up my-12"
        style={{ animationDelay: "0.40s" }}
      />
      <React.Suspense fallback={<MainSkeleton />}>
        <Main />
      </React.Suspense>
    </>
  );
}
