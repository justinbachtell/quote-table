import { api } from "@/trpc/server";

export default async function Types() {
  const allTypes = await api.type.getAll.query();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Types</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allTypes.map((type, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{type.name}</p>
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
