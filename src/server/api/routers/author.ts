import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { authors } from "@/db/schema";

// Create an authorRouter using createTRPCRouter
export const authorRouter = createTRPCRouter({
  // Define a "create" procedure for creating an author (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for author creation
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        birthYear: z.number().optional(),
        deathYear: z.number().optional(),
        nationality: z.string().optional(),
        biography: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx: any) => {
        // Insert a new author into the database
        const authorInsertion = await tx.insert(authors).values({
          firstName: input.firstName,
          lastName: input.lastName,
          birthYear: input.birthYear,
          deathYear: input.deathYear,
          nationality: input.nationality,
          biography: input.biography,
        });

        // Get the ID of the newly created author
        const authorId = Number(authorInsertion.insertId);

        return authorId;
      });
    }),

  // Define a "getAll" procedure for fetching all authors (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.authors.findMany({
      orderBy: (authors: any, { asc }: { asc: any }) => [
        asc(authors.firstName),
        asc(authors.lastName),
      ],
    });
  }),

  // Define a "getRandom" procedure for fetching a random author (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.authors.findFirst({
      orderBy: (authors: any, { asc }: { asc: any }) => [asc(authors.id)],
    });
  }),

  // Define a "getById" procedure for fetching an author by ID (query)
  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.query.authors.findFirst({
      where: (author: any) => eq(author.id, input),
    });
  }),
});
