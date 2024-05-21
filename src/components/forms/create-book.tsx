"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";
import {
  stringRegex,
  alphanumericRegex,
  citationRegex,
  urlRegex,
} from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function CreateBook() {
  // Initialize router
  const router = useRouter();

  // State for book properties
  const [title, setTitle] = useState(undefined);
  const [publicationYear, setPublicationYear] = useState(undefined);
  const [isbn, setIsbn] = useState(undefined);
  const [publisherId, setPublisherId] = useState<number>(0);
  const [summary, setSummary] = useState(undefined);
  const [citation, setCitation] = useState(undefined);
  const [sourceLink, setSourceLink] = useState(undefined);
  const [rating, setRating] = useState(0);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
  const [isAuthorPopoverOpen, setIsAuthorPopoverOpen] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [isGenrePopoverOpen, setIsGenrePopoverOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Queries to fetch data
  const allPublishers = api.publisher.getAll.useQuery();
  const allGenres = api.genre.getAll.useQuery();
  const allAuthors = api.author.getAll.useQuery();

  // Function to reset form and state
  const resetFormAndState = () => {
    // Reset state variables
    setTitle(undefined);
    setPublicationYear(undefined);
    setIsbn(undefined);
    setPublisherId(0);
    setSummary(undefined);
    setCitation(undefined);
    setSourceLink(undefined);
    setRating(0);
    setSelectedAuthorIds([]);
    setSelectedGenreIds([]);
    // Reset form values
    form.reset({
      title: undefined,
      publicationYear: undefined,
      isbn: undefined,
      publisherId: 0,
      summary: undefined,
      citation: undefined,
      sourceLink: undefined,
      rating: 0,
      authorIds: [],
      genreIds: [],
    });
    // Increment resetKey to trigger form reset
    setResetKey((prev) => prev + 1);
  };

  // Mutation to create a book
  const createBook = api.book.create.useMutation({
    onSuccess: () => {
      router.refresh();
      resetFormAndState();
    },
  });

  // Helper function to check if a year is valid
  const currentYear = new Date().getFullYear();
  const isValidYear = (year: number | undefined) => {
    if (year === undefined) return true;
    const numericYear = Number(year);
    return (
      !isNaN(numericYear) && numericYear >= 1 && numericYear <= currentYear
    );
  };

  // Define a Zod schema for book data
  const bookSchema = z.object({
    title: z
      .string()
      .min(1, { message: "Book title must be at least 1 character." })
      .max(255, { message: "Book title must be less than 255 characters." })
      .regex(stringRegex, {
        message:
          "Book title must only contain letters, spaces, parentheses, periods, and hyphens.",
      }),
    publicationYear: z
      .string()
      .refine(
        (val) => {
          const matches = val.match(/^(\d{1,4})(?:\s?(B\.C\.|A\.D\.))?$/);
          if (!matches) return false; // Doesn't match the regex

          // Extract year and era from the regex match
          const [, yearString, era] = matches;
          if (yearString !== undefined) {
            const year = parseInt(yearString, 10);

            // If the year is NaN, it's invalid
            if (isNaN(year)) return false;

            // If the year is less than 0, it's invalid
            if (year < 0) return false;

            // If it's B.C., it's automatically valid since it's before the current era
            if (era === "B.C.") return true;

            // If it's A.D. or no era specified, check if the year is <= current year
            const currentYear = new Date().getFullYear();
            return year <= currentYear;
          }
        },
        {
          message:
            "Invalid year. Must be a number followed by 'B.C.' or 'A.D.', and not greater than the current year if 'A.D.' or no era specified.",
        },
      )
      .optional(),
    isbn: z
      .string()
      .max(255, { message: "Book ISBN must be less than 15 characters." })
      .regex(alphanumericRegex, {
        message: "Book ISBN must only contain letters and numbers.",
      })
      .optional(),
    publisherId: z
      .number()
      .min(1, { message: "Publisher ID must be at least 1" })
      .max(255, {
        message: "Publisher ID must be less than 255 characters",
      }),
    summary: z
      .string()
      .max(255, { message: "Book summary must be less than 255 characters." })
      .regex(stringRegex, {
        message:
          "Book summary must only contain letters, spaces, parentheses, periods, and hyphens.",
      })
      .optional(),
    citation: z
      .string()
      .max(255, {
        message: "Citation must be less than 255 characters",
      })
      .regex(citationRegex, {
        message:
          "Citation must only contain the letters, numbers, spaces, commas, periods, ampersands, parentheses, colons, and hyphens",
      })
      .optional(),
    sourceLink: z
      .string()
      .max(255, {
        message: "Book source link must be less than 255 characters.",
      })
      .regex(urlRegex, {
        message: "Book source link must be a valid URL.",
      })
      .optional(),
    rating: z.number().max(5, { message: "Book rating must be less than 5." }),
    authorIds: z.array(z.number()).optional(),
    genreIds: z.array(z.number()).optional(),
  });

  // Create a form using react-hook-form
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: undefined,
      publicationYear: undefined,
      isbn: undefined,
      publisherId: 0,
      summary: undefined,
      citation: undefined,
      sourceLink: undefined,
      rating: 0,
      authorIds: [],
      genreIds: [],
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof bookSchema>) => {
    const mutationValues = {
      ...values,
      authorIds: selectedAuthorIds,
      genreIds: selectedGenreIds,
    };
    createBook.mutate(mutationValues, {
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Book created successfully.",
        });
        resetFormAndState();
      },
      onError: (error: { message: any }) => {
        toast({
          title: "Error!",
          description: error.message,
        });
      },
    });
  };

  // Helper function to toggle selection of items
  type ArrayFieldNames = "authorIds" | "genreIds";
  const toggleSelection = (
    id: number,
    selectedIds: number[],
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>,
    fieldName: ArrayFieldNames,
  ) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((existingId) => existingId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
    form.setValue(fieldName, newSelection, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col gap-6"
      >
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Book Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-2/3">
                <FormLabel className="font-bold">Book&apos; Title</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Title" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The book&apos; title.</FormDescription>
              </FormItem>
            )}
          />
          {/* Book Rating Field */}
          <FormField
            key={`rating-select-${resetKey}`}
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">Book&apos; Rating</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setRating(Number(value));
                    field.onChange(Number(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select a rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"1"}>1</SelectItem>
                    <SelectItem value={"2"}>2</SelectItem>
                    <SelectItem value={"3"}>3</SelectItem>
                    <SelectItem value={"4"}>4</SelectItem>
                    <SelectItem value={"5"}>5</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The book&apos; title.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Book Authors Field */}
          <FormField
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">Authors</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Popover
                  open={isAuthorPopoverOpen}
                  onOpenChange={setIsAuthorPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        role="combobox"
                        aria-expanded={isAuthorPopoverOpen}
                      >
                        Select Authors
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Select book authors"
                        className="rounded"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No authors found for this book.
                        </CommandEmpty>
                        <CommandGroup>
                          {allAuthors.data?.map((author: any) => (
                            <CommandItem
                              key={author.id}
                              className="cursor-pointer"
                              onSelect={() => {
                                toggleSelection(
                                  author.id,
                                  selectedAuthorIds,
                                  setSelectedAuthorIds,
                                  "authorIds",
                                );
                                field.onChange(selectedAuthorIds);
                              }}
                            >
                              <div className="flex w-full items-center justify-between">
                                {author.firstName} {author.lastName}
                                <Checkbox
                                  checked={selectedAuthorIds.includes(
                                    author.id,
                                  )}
                                  onCheckedChange={() => {
                                    toggleSelection(
                                      author.id,
                                      selectedAuthorIds,
                                      setSelectedAuthorIds,
                                      "authorIds",
                                    );
                                    field.onChange(selectedAuthorIds);
                                  }}
                                />
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the book&apos; authors.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Book Source Link Field */}
          <FormField
            control={form.control}
            name="sourceLink"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">
                  Book&apos; Source Link
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input
                    placeholder="Source Link"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The book&apos; source link.</FormDescription>
              </FormItem>
            )}
          />
          {/* Book Genres Field */}
          <FormField
            control={form.control}
            name="genreIds"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">Genre(s)</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Popover
                  open={isGenrePopoverOpen}
                  onOpenChange={setIsGenrePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        role="combobox"
                        aria-expanded={isGenrePopoverOpen}
                      >
                        Select Genre(s)
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search authors"
                        className="rounded"
                      />
                      <CommandList>
                        <CommandEmpty>No genres found.</CommandEmpty>
                        <CommandGroup>
                          {allGenres.data?.map((genre: any) => (
                            <CommandItem
                              key={genre.id}
                              className="cursor-pointer"
                              onSelect={() => {
                                toggleSelection(
                                  genre.id,
                                  selectedGenreIds,
                                  setSelectedGenreIds,
                                  "genreIds",
                                );
                                field.onChange(selectedGenreIds);
                              }}
                            >
                              <div className="flex w-full items-center justify-between">
                                {genre.name}
                                <Checkbox
                                  checked={selectedGenreIds.includes(genre.id)}
                                  onCheckedChange={() => {
                                    toggleSelection(
                                      genre.id,
                                      selectedGenreIds,
                                      setSelectedGenreIds,
                                      "genreIds",
                                    );
                                    field.onChange(selectedGenreIds);
                                  }}
                                />
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The genre(s) the quote is about.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Book Publication Year Field */}
          <FormField
            control={form.control}
            name="publicationYear"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">
                  Book&apos; Publication Year
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Publication Year"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The book&apos; publication year.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Book ISBN Field */}
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">Book&apos; ISBN</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="ISBN" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The book&apos; ISBN.</FormDescription>
              </FormItem>
            )}
          />
          {/* Book Publisher Field */}
          <FormField
            key={`publisher-select-${resetKey}`}
            control={form.control}
            name="publisherId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">Publisher</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setPublisherId(Number(value));
                    field.onChange(Number(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select a publisher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allPublishers.data?.map((publisher: any) => (
                      <SelectItem
                        key={publisher.id}
                        value={publisher.id.toString()}
                        onClick={() => {
                          setPublisherId(publisher.id);
                        }}
                      >
                        {publisher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The book&apos; publisher.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Book Summary Field */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/2">
                <FormLabel className="font-bold">Book&apos; Summary</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    placeholder="Summary"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The book&apos; summary.</FormDescription>
              </FormItem>
            )}
          />
          {/* Book Citation Field */}
          <FormField
            control={form.control}
            name="citation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/2">
                <FormLabel className="font-bold">Book&apos; Citation</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    placeholder="Citation"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The book&apos; citation.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-4 bg-stone-200" />
        {/* Submit Button */}
        <Button
          type="submit"
          className="border-1 rounded border bg-stone-800 text-white hover:bg-stone-50 hover:text-stone-800"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
