import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { countries } from "@/db/schema";

type NewCountry = typeof countries.$inferInsert;

// Create a countryRouter using createTRPCRouter
export const countryRouter = createTRPCRouter({
  // Define a "create" procedure for creating a country (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for country creation
      z.object({
        name: z.string(),
        stateIds: z.array(z.number()).optional(),
        cityIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx) => {
        try {
          // Insert the country into the database
          const countryInsertion = await tx
            .insert(countries)
            .values({
              name: input.name,
            } as NewCountry)
            .returning({ id: countries.id });

          if (countryInsertion.length === 0) {
            throw new Error("Failed to insert the country.");
          }

          if (countryInsertion[0]?.id === undefined) {
            throw new Error(
              "Failed to insert the country. The id is undefined.",
            );
          }

          const countryId = countryInsertion[0].id;

          if (isNaN(countryId)) {
            throw new Error(
              "Failed to insert the country. The id is not a number.",
            );
          }

          return countryId;
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    }),

  // Define a "getAll" procedure for fetching all countries (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.countries.findMany({
      orderBy: (countries, { asc }) => [asc(countries.name)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random country (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.countries.findFirst({
      orderBy: (countries, { asc }) => [asc(countries.id)],
    });
  }),
});
