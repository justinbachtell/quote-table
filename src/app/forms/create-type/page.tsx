// import { api } from "@/trpc/server";
import { CreateType } from "@/components/forms/create-type";

export default async function Types() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Type</h1>
      <CreateType />
    </main>
  );
}
