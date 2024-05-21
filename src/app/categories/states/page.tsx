import { api } from "@/trpc/server";

export default async function States() {
  const allStates = await api.state.getAll();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">States</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allStates.map((state, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{state.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
