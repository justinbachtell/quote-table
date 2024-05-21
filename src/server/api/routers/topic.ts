import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { topics } from "@/db/schema";

type NewTopic = typeof topics.$inferInsert;

export const topicRouter = createTRPCRouter({
  // Define a "create" procedure for creating a topic (mutation)
  create: protectedProcedure
    .input(
      // Define input validation schema for creating topics
      z.object({
        name: z.string(),
        description: z.string(),
        quoteIds: z.array(z.number()).optional(),
        authorIds: z.array(z.number()).optional(),
        bookIds: z.array(z.number()).optional(),
        tagIds: z.array(z.number()).optional(),
        typeIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use a database transaction to ensure data consistency
      return ctx.db.transaction(async (tx) => {
        // Insert the topic into the database
        const topicInsertion = await tx
          .insert(topics)
          .values({
            name: input.name,
            description: input.description,
          } as NewTopic)
          .returning({ id: topics.id });

        if (topicInsertion.length === 0) {
          throw new Error("Failed to insert the topic.");
        }

        if (topicInsertion[0]?.id === undefined) {
          throw new Error("Failed to insert the topic. The id is undefined.");
        }

        const topicId = topicInsertion[0].id;

        if (isNaN(topicId)) {
          throw new Error(
            "Failed to insert the topic. The id is not a number.",
          );
        }

        return topicId;
      });
    }),

  // Define a "getAll" procedure for fetching all topics (query)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.topics.findMany({
      orderBy: (topics, { asc }) => [asc(topics.name)],
    });
  }),

  // Define a "getRandom" procedure for fetching a random topic (query)
  getRandom: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.topics.findFirst({
      orderBy: (topics, { asc }) => [asc(topics.id)],
    });
  }),

  // Define a "getById" procedure for fetching a topic by its ID (query)
  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.query.topics.findFirst({
      where: (topics, { eq }) => eq(topics.id, input),
    });
  }),
});
