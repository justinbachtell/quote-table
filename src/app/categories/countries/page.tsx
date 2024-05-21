import { api } from "@/trpc/server";

export default async function Countries() {
  const allCountries = await api.country.getAll.query();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Countries</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allCountries.map((country, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{country.name}</p>
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
