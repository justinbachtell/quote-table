import { api } from "@/trpc/server";

export default async function Cities() {
  const allCities = await api.city.getAll.query();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Cities</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allCities.map((city, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{city.name}</p>
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
