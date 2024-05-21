// import { api } from "@/trpc/server";

import { CreateAuthor } from "@/components/forms/create-author";

export default async function Authors() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Author</h1>
      <CreateAuthor />
    </main>
  );
}
