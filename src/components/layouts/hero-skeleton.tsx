import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <Shell className="max-w-6xl">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-7 w-44" />
        <h1 className="text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
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
