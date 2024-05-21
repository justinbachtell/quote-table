import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";
import { quoteRouter } from "./routers/quote";
import { authorRouter } from "./routers/author";
import { bookRouter } from "./routers/book";
import { publisherRouter } from "./routers/publisher";
import { genreRouter } from "./routers/genre";
import { topicRouter } from "./routers/topic";
import { tagRouter } from "./routers/tag";
import { typeRouter } from "./routers/type";
import { cityRouter } from "./routers/city";
import { stateRouter } from "./routers/state";
import { countryRouter } from "./routers/country";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quote: quoteRouter,
  author: authorRouter,
  book: bookRouter,
  publisher: publisherRouter,
  genre: genreRouter,
  topic: topicRouter,
  tag: tagRouter,
  type: typeRouter,
  city: cityRouter,
  state: stateRouter,
  country: countryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
