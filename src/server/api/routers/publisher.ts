import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { publishers, cities, publishersToCities } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CityDetails {
  stateId: number | null;
  countryId: number;
}

type NewPublisher = typeof publishers.$inferInsert;

export const publisherRouter = createTRPCRouter({
  // Define a "create" procedure for creating a publisher (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for publisher creation
      z.object({
        name: z.string(),
        cityId: z.number(),
        stateId: z.number().optional(),
        countryId: z.number().optional(),
        bookIds: z.array(z.number()).optional(),
        authorIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx) => {
        // Fetch city details including stateId and countryId
        const cityResults: CityDetails[] = await tx
          .select({
            stateId: cities.stateId,
            countryId: cities.countryId,
          })
          .from(cities)
          .where(eq(cities.id, input.cityId))
          .execute();

        // Check if cityDetails exist before proceeding
        const cityDetails = cityResults[0];
        if (!cityDetails) {
          throw new Error("City not found.");
        }

        // Now, check for null stateId if your logic requires a stateId
        if (cityDetails.stateId === null) {
          // Handle the case where stateId is not necessary or provide a fallback
          throw new Error("City does not have a related state.");
        }

        // Insert the publisher into the database
        const publisherInsertion = await tx
          .insert(publishers)
          .values({
            name: input.name,
            cityId: input.cityId,
            stateId: cityDetails.stateId,
            countryId: cityDetails.countryId,
          } as NewPublisher)
          .returning({ id: publishers.id });

        if (publisherInsertion.length === 0) {
          throw new Error("Failed to insert the publisher.");
        }

        if (publisherInsertion[0]?.id === undefined) {
          throw new Error(
            "Failed to insert the publisher. The id is undefined.",
          );
        }

        const publisherId = publisherInsertion[0].id;

        if (isNaN(publisherId)) {
          throw new Error(
            "Failed to insert the publisher. The id is not a number.",
          );
        }

        // Insert relationships
        await tx
          .insert(publishersToCities)
          .values({ publisherId, cityId: input.cityId })
          .execute();

        return publisherId;
      });
    }),

  // Define a "getAll" procedure for fetching all publishers (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.publishers.findMany({
      orderBy: (publishers, { asc }) => [asc(publishers.name)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random publisher (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.publishers.findFirst({
      orderBy: (publishers, { asc }) => [asc(publishers.id)],
    });
  }),
});
