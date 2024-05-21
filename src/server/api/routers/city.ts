import { z } from "zod";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { cities, states, statesToCities, countriesToCities } from "@/db/schema";

type NewCity = typeof cities.$inferInsert;

// Create a cityRouter using createTRPCRouter
export const cityRouter = createTRPCRouter({
  // Define a "create" procedure for creating a city (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for city creation
      z.object({
        name: z.string(),
        stateId: z.number().optional(),
        countryId: z.number(),
        publisherIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx) => {
        let countryId = input.countryId;

        // Check if stateId is provided and valid
        if (input.stateId) {
          const stateResult = await tx
            .select({ countryId: states.countryId })
            .from(states)
            .where(eq(states.id, input.stateId));

          if (stateResult.length > 0 && stateResult[0] !== undefined) {
            countryId = stateResult[0].countryId;
          } else {
            throw new Error("Invalid state ID");
          }
        }

        // Insert the city into the database
        const cityInsertion = await tx
          .insert(cities)
          .values({
            name: input.name,
            stateId: input.stateId ?? undefined,
            countryId,
          } as NewCity)
          .returning({ id: cities.id });

        if (cityInsertion.length === 0) {
          throw new Error("Failed to insert the city.");
        }

        if (cityInsertion[0]?.id === undefined) {
          throw new Error("Failed to insert the city. The id is undefined.");
        }

        const cityId = cityInsertion[0].id;

        if (isNaN(cityId)) {
          throw new Error("Failed to insert the city. The id is not a number.");
        }

        // Insert into statesToCities if stateId is provided
        if (input.stateId) {
          await tx.insert(statesToCities).values({
            stateId: input.stateId,
            cityId,
          });
        }

        // Insert into countriesToCities
        await tx.insert(countriesToCities).values({
          countryId,
          cityId,
        });

        return cityId;
      });
    }),

  // Define a "getAll" procedure for fetching all cities (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.cities.findMany({
      orderBy: (cities, { asc }) => [asc(cities.name)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random city (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.cities.findFirst({
      orderBy: (cities, { asc }) => [asc(cities.id)],
    });
  }),
});
