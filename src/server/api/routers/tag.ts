import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { tags } from "@/db/schema";

type NewTag = typeof tags.$inferInsert;

export const tagRouter = createTRPCRouter({
  // Define a "create" procedure for creating a tag (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for creating tags
      z.object({
        name: z.string(),
        description: z.string(),
        quoteIds: z.array(z.number()).optional(),
        authorIds: z.array(z.number()).optional(),
        bookIds: z.array(z.number()).optional(),
        topicIds: z.array(z.number()).optional(),
        typeIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx) => {
        // Insert the tag into the database
        const tagInsertion = await tx
          .insert(tags)
          .values({
            name: input.name,
            description: input.description,
          } as NewTag)
          .returning({ id: tags.id });

        if (tagInsertion.length === 0) {
          throw new Error("Failed to insert the tag.");
        }

        if (tagInsertion[0]?.id === undefined) {
          throw new Error("Failed to insert the tag. The id is undefined.");
        }

        const tagId = tagInsertion[0].id;

        if (isNaN(tagId)) {
          throw new Error("Failed to insert the tag. The id is not a number.");
        }

        return tagId;
      });
    }),

  // Define a "getAll" procedure for fetching all tags (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.tags.findMany({
      orderBy: (tags, { asc }) => [asc(tags.name)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random tag (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.tags.findFirst({
      orderBy: (tags, { asc }) => [asc(tags.id)],
    });
  }),

  // Define a "getById" procedure for fetching a tag by its ID (query)
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.tags.findFirst({
      where: (tags, { eq }) => eq(tags.id, input),
    });
  }),
});
