import { api } from "@/trpc/server";

export default async function Books() {
  const allBooks = await api.book.getAll.query();

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">Books</h1>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                {allBooks.map((book, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <p className="my-10 truncate">{book.title}</p>
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
