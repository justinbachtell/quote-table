import * as React from "react";
import { currentUser } from "@clerk/nextjs/server";

import { Shell } from "@/components/shell";
import { api } from "@/trpc/server";
import { DataTable } from "@/components/tables/default/data-table";
import { columns } from "@/components/tables/default/columns";

export async function Main() {
  return (
    <Shell className="overflow-x-hidden">
      <QuoteTable />
    </Shell>
  );
}

async function QuoteTable() {
  const user = await currentUser();

  /* // Get the user ID from the session
    const sessionUserId = session?.user.id; */

  // Get the user ID from the session
  const sessionUserId = user?.id;

  // Get all quotes with books and authors
  const quotesWithBookAndAuthors = (await api.quote.getAllWithBooksAndAuthors())
    // Filter out private quotes that don't belong to the current user
    .filter((quote) => {
      return quote.isPrivate === false || quote.userId === sessionUserId;
    })
    // Map the quotes to the format expected by the table
    .map((quote) => ({
      ...quote,
      pageNumber: quote.pageNumber === null ? undefined : quote.pageNumber,
      quotedBy: quote.quotedBy ?? undefined,
      isPrivate: quote.isPrivate ?? undefined,
      quoteAuthors: quote.quoteAuthors ?? undefined,
      quoteTopics: quote.quoteTopics ?? undefined,
      quoteTypes: quote.quoteTypes ?? undefined,
      quoteTags: quote.quoteTags ?? undefined,
    }));

  return (
    <div className="w-full overflow-x-scroll">
      <DataTable columns={columns} data={quotesWithBookAndAuthors} />
    </div>
  );
}
