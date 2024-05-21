import { Shell } from "@/components/shell";
import { Icons } from "@/components/icons";

export function MainSkeleton() {
  return (
    <Shell>
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <figure className="relative m-auto flex h-full w-full flex-col items-center justify-center">
          <Icons.spinner className="m-auto h-20 w-20 animate-spin" />
        </figure>
      </section>
    </Shell>
  );
}
