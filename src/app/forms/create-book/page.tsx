// import { api } from "@/trpc/server";
import { CreateBook } from "@/components/forms/create-book";

export default async function Books() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Book</h1>
      <CreateBook />
    </main>
  );
}
