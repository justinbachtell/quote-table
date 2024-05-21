import { api } from "@/trpc/server";
import { quotes } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { DataTable } from "@/components/tables/default/data-table";
import { columns } from "@/components/tables/default/columns";

export default async function Authors() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col">
          <AuthorTable />
        </div>
      </main>
    </>
  );
}

async function AuthorTable() {
  const user = await currentUser();
  const userId = user?.id;

  // Get all quotes with books and authors
  const quotesWithBookAndAuthors = (await api.quote.getAllWithBooksAndAuthors())
    .filter((quote) => {
      return quote.isPrivate === false || quote.userId === userId;
    })
    // Map the quotes to the format expected by the table
    .map((quote) => ({
      ...quote,
      pageNumber: quote.pageNumber === null ? undefined : quote.pageNumber,
      isPrivate: quote.isPrivate ?? undefined,
    }));

  return (
    <div className="w-full">
      <DataTable columns={columns} data={quotesWithBookAndAuthors} />
    </div>
  );
}
