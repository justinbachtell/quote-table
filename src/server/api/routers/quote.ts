import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  quotes,
  books,
  booksToAuthors,
  quotesToAuthors,
  quotesToTopics,
  quotesToTags,
  quotesToTypes,
} from "@/db/schema";
import { eq } from "drizzle-orm";

type QuoteWithBookAndAuthors = {
  id: number;
  userId: string;
  text: string;
  bookId: number;
  citation: string | null | undefined;
  pageNumber: string | null | undefined;
  context: string | null | undefined;
  quotedBy: number | null | undefined;
  quotedAuthor: string | undefined;
  isImportant: boolean | null;
  isPrivate: boolean | null;
  bookTitle: string;
  quoteAuthors: string[];
  quoteTopics: string[];
  quoteTags: string[];
  quoteTypes: string[];
};

type NewQuote = typeof quotes.$inferInsert;

export const quoteRouter = createTRPCRouter({
  // Define a "create" procedure for creating a quote (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for creating quotes
      z.object({
        text: z.string(),
        bookId: z.number(),
        context: z.string().optional(),
        pageNumber: z.string().optional(),
        quotedBy: z.number().optional(),
        isImportant: z.boolean(),
        isPrivate: z.boolean(),
        topicIds: z.array(z.number()).optional(),
        tagIds: z.array(z.number()).optional(),
        typeIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx: any) => {
        try {
          // Check if the user is logged in
          if (!ctx.session?.id) {
            throw new Error("You must be logged in to create a quote.");
          }

          // Insert the quote into the database
          const quoteInsertion = await tx
            .insert(quotes)
            .values({
              userId: ctx.session?.id,
              text: input.text,
              bookId: input.bookId,
              context: input.context,
              pageNumber: input.pageNumber,
              quotedBy: input.quotedBy,
              isImportant: input.isImportant,
              isPrivate: input.isPrivate,
            } as NewQuote)
            .returning({ id: quotes.id });

          if (quoteInsertion.length === 0) {
            throw new Error("Failed to insert the quote.");
          }

          if (quoteInsertion[0]?.id === undefined) {
            throw new Error("Failed to insert the quote. The id is undefined.");
          }

          const quoteId = quoteInsertion[0].id;

          if (isNaN(quoteId)) {
            throw new Error(
              "Failed to insert the quote. The id is not a number.",
            );
          }

          // Automatically associate authors with the quote based on the bookId
          if (input.bookId) {
            const authorsForBook = await tx
              .select({ authorId: booksToAuthors.authorId })
              .from(booksToAuthors)
              .where(eq(booksToAuthors.bookId, input.bookId));

            if (authorsForBook.length > 0 && authorsForBook[0] !== undefined) {
              for (const author of authorsForBook) {
                await tx
                  .insert(quotesToAuthors)
                  .values({
                    quoteId: quoteId,
                    authorId: author.authorId,
                  })
                  .execute();
              }
            }
          }

          // Insert associations with topics
          if (input.topicIds) {
            for (const topicId of input.topicIds) {
              await tx
                .insert(quotesToTopics)
                .values({
                  quoteId: quoteId,
                  topicId: topicId,
                })
                .execute();
            }
          }

          // Insert associations with tags
          if (input.tagIds) {
            for (const tagId of input.tagIds) {
              await tx
                .insert(quotesToTags)
                .values({
                  quoteId: quoteId,
                  tagId: tagId,
                })
                .execute();
            }
          }

          // Insert associations with types
          if (input.typeIds) {
            for (const typeId of input.typeIds) {
              await tx
                .insert(quotesToTypes)
                .values({
                  quoteId: quoteId,
                  typeId: typeId,
                })
                .execute();
            }
          }

          return quoteId;
        } catch (error) {
          console.error(error);
          throw new Error("Failed to create the quote");
        }
      });
    }),

  // Define a "update" procedure for updating a quote (mutation)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        text: z.string().optional(),
        bookId: z.number().optional(),
        context: z.string().optional(),
        pageNumber: z.string().optional(),
        quotedBy: z.number().optional(),
        isImportant: z.boolean().optional(),
        isPrivate: z.boolean().optional(),
        topicIds: z.array(z.number()).optional(),
        tagIds: z.array(z.number()).optional(),
        typeIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx: any) => {
        try {
          // Update the quote in the database
          await tx
            .update(quotes)
            .set({
              text: input.text,
              bookId: input.bookId,
              context: input.context,
              pageNumber: input.pageNumber,
              quotedBy: input.quotedBy,
              isImportant: input.isImportant,
              isPrivate: input.isPrivate,
            })
            .where(eq(quotes.id, input.id))
            .execute();

          // Update topics
          if (input.topicIds) {
            await tx
              .delete(quotesToTopics)
              .where(eq(quotesToTopics.quoteId, input.id))
              .execute();

            for (const topicId of input.topicIds) {
              await tx
                .insert(quotesToTopics)
                .values({
                  quoteId: input.id,
                  topicId: topicId,
                })
                .execute();
            }
          }

          // Update tags
          if (input.tagIds) {
            await tx
              .delete(quotesToTags)
              .where(eq(quotesToTags.quoteId, input.id))
              .execute();

            for (const tagId of input.tagIds) {
              await tx
                .insert(quotesToTags)
                .values({
                  quoteId: input.id,
                  tagId: tagId,
                })
                .execute();
            }
          }

          // Update types
          if (input.typeIds) {
            await tx
              .delete(quotesToTypes)
              .where(eq(quotesToTypes.quoteId, input.id))
              .execute();

            for (const typeId of input.typeIds) {
              await tx
                .insert(quotesToTypes)
                .values({
                  quoteId: input.id,
                  typeId: typeId,
                })
                .execute();
            }
          }

          return `Quote with ID ${input.id} was successfully updated.`;
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    }),

  // Define a "delete" procedure for deleting a quote (mutation)
  delete: protectedProcedure
    .input(z.number()) // expects the ID of the quote to delete
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx: any) => {
        if (!ctx.session?.id) {
          throw new Error("You must be logged in to delete a quote.");
        }

        try {
          // Delete associations in related tables first to maintain referential integrity
          await tx
            .delete(quotesToAuthors)
            .where(eq(quotesToAuthors.quoteId, input))
            .execute();
          await tx
            .delete(quotesToTopics)
            .where(eq(quotesToTopics.quoteId, input))
            .execute();
          await tx
            .delete(quotesToTags)
            .where(eq(quotesToTags.quoteId, input))
            .execute();
          await tx
            .delete(quotesToTypes)
            .where(eq(quotesToTypes.quoteId, input))
            .execute();

          // Now delete the quote itself
          const deletion = await tx
            .delete(quotes)
            .where(eq(quotes.id, input))
            .execute();

          // Check if the deletion was successful by ensuring deletion is not null
          if (!deletion) {
            throw new Error(`Failed to delete the quote with ID ${input}`);
          }

          return `Quote with ID ${input} was successfully deleted.`;
        } catch (error) {
          console.error(error);
          throw new Error("Failed to delete the quote");
        }
      });
    }),

  // Define a "getAll" procedure for fetching all quotes (query)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.quotes.findMany({
      orderBy: (quotes: any, { asc }: { asc: any }) => [asc(quotes.id)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random quote (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.quotes.findFirst({
      orderBy: (quotes: any, { asc }: { asc: any }) => [asc(quotes.id)],
    });
  }),

  // Define a "getAuthors" procedure for fetching authors of a specific quote (query)
  getAuthors: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.quotesToAuthors.findMany({
        where: (quotesToAuthors: any, { eq }: { eq: any }) =>
          eq(quotesToAuthors.quoteId, input),
      });
    }),
  // Define a "getAllWithBooksAndAuthors" procedure for fetching quotes with book and author details (query)
  getAllWithBooksAndAuthors: publicProcedure.query(
    async ({ ctx }): Promise<QuoteWithBookAndAuthors[]> => {
      // Fetch quotes with book details
      const quotesWithBooks = await ctx.db
        .select({
          id: quotes.id,
          userId: quotes.userId,
          text: quotes.text,
          bookId: quotes.bookId,
          bookTitle: books.title,
          citation: books.citation,
          pageNumber: quotes.pageNumber,
          context: quotes.context,
          quotedBy: quotes.quotedBy,
          isImportant: quotes.isImportant,
          isPrivate: quotes.isPrivate,
        })
        .from(quotes)
        .innerJoin(books, eq(quotes.bookId, books.id))
        .execute();

      // Fetch all relationships in separate queries
      const quotesToAuthorsData = await ctx.db.query.quotesToAuthors.findMany(
        {},
      );
      const quotesToTopicsData = await ctx.db.query.quotesToTopics.findMany({});
      const quotesToTagsData = await ctx.db.query.quotesToTags.findMany({});
      const quotesToTypesData = await ctx.db.query.quotesToTypes.findMany({});

      // Fetch all related entities in separate queries
      const authorsData = await ctx.db.query.authors.findMany({});
      const topicsData = await ctx.db.query.topics.findMany({});
      const tagsData = await ctx.db.query.tags.findMany({});
      const typesData = await ctx.db.query.types.findMany({});

      // Map through each quote and enrich with related data
      const quotesWithAuthors = quotesWithBooks.map((quote: any) => {
        // Fetch the quoted author's details
        let quotedAuthorName = "Unknown Author";
        const quoteAuthorsIds = quotesToAuthorsData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.authorId);
        const quoteAuthors = authorsData
          .filter((author: any) => quoteAuthorsIds.includes(author.id))
          .map((author: any) => `${author.firstName} ${author.lastName}`);

        const quoteTopicsIds = quotesToTopicsData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.topicId);
        const quoteTopics = topicsData
          .filter((topic: any) => quoteTopicsIds.includes(topic.id))
          .map((topic: any) => topic.name);

        const quoteTagsIds = quotesToTagsData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.tagId);
        const quoteTags = tagsData
          .filter((tag: any) => quoteTagsIds.includes(tag.id))
          .map((tag: any) => tag.name);

        const quoteTypesIds = quotesToTypesData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.typeId);
        const quoteTypes = typesData
          .filter((type: any) => quoteTypesIds.includes(type.id))
          .map((type: any) => type.name);

        return {
          ...quote,
          quotedAuthor: quotedAuthorName,
          quoteAuthors: quoteAuthors,
          quoteTopics: quoteTopics,
          quoteTags: quoteTags,
          quoteTypes: quoteTypes,
        };
      });

      return quotesWithAuthors;
    },
  ),
  // Define a "getQuoteWithBookAndAuthorsById" procedure for fetching a quote with book and author details by ID (query)
  getQuoteWithBookAndAuthorsById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }): Promise<QuoteWithBookAndAuthors[]> => {
      // Fetch quotes with book details
      const quotesWithBooks = await ctx.db
        .select({
          id: quotes.id,
          userId: quotes.userId,
          text: quotes.text,
          bookId: quotes.bookId,
          bookTitle: books.title,
          citation: books.citation,
          pageNumber: quotes.pageNumber,
          context: quotes.context,
          quotedBy: quotes.quotedBy,
          isImportant: quotes.isImportant,
          isPrivate: quotes.isPrivate,
        })
        .from(quotes)
        .where(eq(quotes.id, input))
        .innerJoin(books, eq(quotes.bookId, books.id))
        .execute();

      // Fetch all relationships in separate queries
      const quotesToAuthorsData = await ctx.db.query.quotesToAuthors.findMany(
        {},
      );
      const quotesToTopicsData = await ctx.db.query.quotesToTopics.findMany({});
      const quotesToTagsData = await ctx.db.query.quotesToTags.findMany({});
      const quotesToTypesData = await ctx.db.query.quotesToTypes.findMany({});

      // Fetch all related entities in separate queries
      const authorsData = await ctx.db.query.authors.findMany({});
      const topicsData = await ctx.db.query.topics.findMany({});
      const tagsData = await ctx.db.query.tags.findMany({});
      const typesData = await ctx.db.query.types.findMany({});

      // Map through each quote and enrich with related data
      const quotesWithAuthors = quotesWithBooks.map((quote: any) => {
        // Fetch the quoted author's details
        let quotedAuthorName = "Unknown Author";
        if (quote.quotedBy) {
          const quotedAuthor = authorsData.find(
            (author: any) => author.id === quote.quotedBy,
          );
          if (quotedAuthor) {
            quotedAuthorName = `${quotedAuthor.firstName} ${quotedAuthor.lastName}`;
          }
        }

        const quoteAuthorsIds = quotesToAuthorsData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.authorId);
        const quoteAuthors = authorsData
          .filter((author: any) => quoteAuthorsIds.includes(author.id))
          .map((author: any) => `${author.firstName} ${author.lastName}`);

        const quoteTopicsIds = quotesToTopicsData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.topicId);
        const quoteTopics = topicsData
          .filter((topic: any) => quoteTopicsIds.includes(topic.id))
          .map((topic: any) => topic.id);

        const quoteTagsIds = quotesToTagsData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.tagId);
        const quoteTags = tagsData
          .filter((tag: any) => quoteTagsIds.includes(tag.id))
          .map((tag: any) => tag.id);

        const quoteTypesIds = quotesToTypesData
          .filter((qta: any) => qta.quoteId === quote.id)
          .map((qta: any) => qta.typeId);
        const quoteTypes = typesData
          .filter((type: any) => quoteTypesIds.includes(type.id))
          .map((type: any) => type.id);

        return {
          ...quote,
          quotedAuthor: quotedAuthorName,
          quoteAuthors: quoteAuthors,
          quoteTopics: quoteTopics.map(String),
          quoteTags: quoteTags.map(String),
          quoteTypes: quoteTypes.map(String),
        };
      });

      return quotesWithAuthors;
    }),

  // Define a "getQuoteById" procedure for fetching a quote by ID (query)
  getQuoteById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.quotes.findMany({
        where: (quotes: any, { eq }: { eq: any }) => eq(quotes.id, input),
      });
    }),

  // Define a "getTopicById" procedure for fetching a topic by ID (query)
  getTopicById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.quotesToTopics.findMany({
      where: (quotesToTopics: any, { eq }: { eq: any }) =>
        eq(quotesToTopics.topicId, input),
    });
  }),

  // Define a "getTopicByName" procedure for fetching a topic by name (query)
  getTopicByName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.topics.findMany({
        where: (topics: any, { eq }: { eq: any }) => eq(topics.name, input),
        orderBy: (topics: any, { asc }: { asc: any }) => [asc(topics.name)],
      });
    }),

  // Define a "getTagById" procedure for fetching a tag by ID (query)
  getTagById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.quotesToTags.findMany({
      where: (quotesToTags: any, { eq }: { eq: any }) =>
        eq(quotesToTags.tagId, input),
    });
  }),

  // Define a "getTagByName" procedure for fetching a tag by name (query)
  getTagByName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.tags.findMany({
        where: (tags: any, { eq }: { eq: any }) => eq(tags.name, input),
        orderBy: (tags: any, { asc }: { asc: any }) => [asc(tags.name)],
      });
    }),

  // Define a "getTypeById" procedure for fetching a type by ID (query)
  getTypeById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.quotesToTypes.findMany({
      where: (quotesToTypes: any, { eq }: { eq: any }) =>
        eq(quotesToTypes.typeId, input),
    });
  }),

  // Define a "getTypeByName" procedure for fetching a type by name (query)
  getTypeByName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.types.findMany({
        where: (types: any, { eq }: { eq: any }) => eq(types.name, input),
        orderBy: (types: any, { asc }: { asc: any }) => [asc(types.name)],
      });
    }),
});
