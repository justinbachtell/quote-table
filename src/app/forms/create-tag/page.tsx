// import { api } from "@/trpc/server";
import { CreateTag } from "@/components/forms/create-tag";

export default async function Tags() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Tag</h1>
      <CreateTag />
    </main>
  );
}
