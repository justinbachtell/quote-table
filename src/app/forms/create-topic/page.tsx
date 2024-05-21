// import { api } from "@/trpc/server";
import { CreateTopic } from "@/components/forms/create-topic";

export default async function Topics() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Topic</h1>
      <CreateTopic />
    </main>
  );
}
