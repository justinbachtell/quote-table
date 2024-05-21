// import { api } from "@/trpc/server";
import { CreateQuote } from "@/components/forms/create-quote";

export default async function Quotes() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create Quote</h1>
      <CreateQuote />
    </main>
  );
}
