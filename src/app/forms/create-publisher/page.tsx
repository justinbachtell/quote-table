// import { api } from "@/trpc/server";
import { CreatePublisher } from "@/components/forms/create-publisher";

export default async function Publishers() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Publisher</h1>
      <CreatePublisher />
    </main>
  );
}
