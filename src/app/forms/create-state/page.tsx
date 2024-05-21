// import { api } from "@/trpc/server";
import { CreateState } from "@/components/forms/create-state";

export default async function States() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create State</h1>
      <CreateState />
    </main>
  );
}
