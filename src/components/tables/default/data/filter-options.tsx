import { api } from "@/trpc/react";

export default function useFilters() {
  const books = useBooks();
  const authors = useAuthors();
  const quoted = useQuoted();
  const topics = useTopics();
  const tags = useTags();
  const types = useTypes();
  const genres = useGenres();

  return { books, authors, quoted, topics, tags, types, genres };
}

export const useBooks = () => {
  const getBooks = api.book.getAll.useQuery();

  const books = getBooks.data?.map((book: any) => book.title) ?? [];

  return books;
};

export const useAuthors = () => {
  const getAuthors = api.author.getAll.useQuery();

  const authors =
    getAuthors.data?.map(
      (author: any) => author.firstName + " " + author.lastName,
    ) ?? [];

  return authors;
};

export const useQuoted = () => {
  const getQuotedAuthors = api.author.getAll.useQuery();

  const quotedAuthors =
    getQuotedAuthors.data?.map(
      (author: any) => author.firstName + " " + author.lastName,
    ) ?? [];

  return quotedAuthors;
};

export const useTopics = () => {
  const getTopics = api.topic.getAll.useQuery();

  const topics = getTopics.data?.map((topic: any) => topic.name) ?? [];

  return topics;
};

export const useTags = () => {
  const getTags = api.tag.getAll.useQuery();

  const tags = getTags.data?.map((tag: any) => tag.name) ?? [];

  return tags;
};

export const useTypes = () => {
  const getTypes = api.type.getAll.useQuery();

  const types = getTypes.data?.map((type: any) => type.name) ?? [];

  return types;
};

export const useGenres = () => {
  const getGenres = api.genre.getAll.useQuery();

  const genres = getGenres.data?.map((genre: any) => genre.name) ?? [];

  return genres;
};
