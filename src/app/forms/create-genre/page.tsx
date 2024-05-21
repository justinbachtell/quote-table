// import { api } from "@/trpc/server";
import { CreateGenre } from "@/components/forms/create-genre";

export default async function Genres() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Genre</h1>
      <CreateGenre />
    </main>
  );
}
