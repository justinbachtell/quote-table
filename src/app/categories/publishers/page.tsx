import { api } from "@/trpc/server";

export default async function Publishers() {
  const allPublishers = await api.publisher.getAll.query();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Publishers</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allPublishers.map((publisher, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{publisher.name}</p>
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
