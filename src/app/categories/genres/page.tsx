import { api } from "@/trpc/server";

export default async function Genres() {
  const allGenres = await api.genre.getAll();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Genres</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allGenres.map((genre, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{genre.name}</p>
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
