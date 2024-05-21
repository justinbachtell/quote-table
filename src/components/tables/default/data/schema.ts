import { z } from "zod";

export const quoteLibrarySchema = z.object({
  text: z.string(),
  bookTitle: z.string(),
  pageNumber: z.string().optional(),
  quotedAuthor: z.string().optional(),
  isPrivate: z.boolean().optional(),
  quoteAuthors: z.array(z.string()),
  quoteTopics: z.array(z.string()).optional(),
  quoteTags: z.array(z.string()).optional(),
  quoteTypes: z.array(z.string()).optional(),
  quoteGenres: z.array(z.string()).optional(),
});

export type Quote = z.infer<typeof quoteLibrarySchema>;
