import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { types } from "@/db/schema";

type NewType = typeof types.$inferInsert;

export const typeRouter = createTRPCRouter({
  // Define a "create" procedure for creating a type (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for creating types
      z.object({
        name: z.string(),
        description: z.string(),
        quoteIds: z.array(z.number()).optional(),
        authorIds: z.array(z.number()).optional(),
        bookIds: z.array(z.number()).optional(),
        tagIds: z.array(z.number()).optional(),
        topicIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx) => {
        // Insert the type into the database
        const typeInsertion = await tx
          .insert(types)
          .values({
            name: input.name,
            description: input.description,
          } as NewType)
          .returning({ id: types.id });

        if (typeInsertion.length === 0) {
          throw new Error("Failed to insert the type.");
        }

        if (typeInsertion[0]?.id === undefined) {
          throw new Error("Failed to insert the type. The id is undefined.");
        }

        const typeId = typeInsertion[0].id;

        if (isNaN(typeId)) {
          throw new Error("Failed to insert the type. The id is not a number.");
        }
        return typeId;
      });
    }),

  // Define a "getAll" procedure for fetching all types (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.types.findMany({
      orderBy: (types, { asc }) => [asc(types.name)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random type (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.types.findFirst({
      orderBy: (types, { asc }) => [asc(types.id)],
    });
  }),

  // Define a "getById" procedure for fetching a type by its ID (query)
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.types.findFirst({
      where: (types, { eq }) => eq(types.id, input),
    });
  }),
});
