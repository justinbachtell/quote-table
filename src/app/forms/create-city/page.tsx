// import { api } from "@/trpc/server";
import { CreateCity } from "@/components/forms/create-city";

export default async function Citys() {
  return (
    <main className="container flex min-h-screen w-full flex-col">
      <h1 className="text-3xl font-bold">Create City</h1>
      <CreateCity />
    </main>
  );
}
