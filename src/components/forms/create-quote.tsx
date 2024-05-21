"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";
import { stringRegex, alphanumericRegex } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export function CreateQuote() {
  const router = useRouter();

  // State variables for form inputs and selections
  const [text, setText] = useState("");
  const [bookId, setBookId] = useState<number>(0);
  const [context, setContext] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [quotedBy, setQuotedBy] = useState<number>(0);
  const [isImportant, setIsImportant] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [isTopicPopoverOpen, setIsTopicPopoverOpen] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
  const [isTypePopoverOpen, setIsTypePopoverOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Query data for dropdowns
  const getBooks = api.book.getAll.useQuery();
  const getAuthors = api.author.getAll.useQuery();
  const getTopics = api.topic.getAll.useQuery();
  const getTags = api.tag.getAll.useQuery();
  const getTypes = api.type.getAll.useQuery();

  // Function to reset form and state
  const resetFormAndState = () => {
    setText("");
    setBookId(0);
    setContext("");
    setPageNumber("");
    setQuotedBy(0);
    setIsImportant(false);
    setIsPrivate(false);
    setSelectedTopicIds([]);
    setSelectedTagIds([]);
    setSelectedTypeIds([]);
    setResetKey((prev) => prev + 1);
    form.reset({
      text: undefined,
      bookId: 0,
      context: undefined,
      pageNumber: undefined,
      quotedBy: 0,
      isImportant: false,
      isPrivate: false,
      authorIds: [],
      topicIds: [],
      tagIds: [],
      typeIds: [],
    });
    setResetKey((prev) => prev + 1);
  };

  // Mutation for creating a quote
  const createQuote = api.quote.create.useMutation({
    onSuccess: () => {
      router.refresh();
      resetFormAndState();
    },
    onError: (error: { message: any }) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  // Mutation for creating a quote and adding another
  const createQuoteAndAddAnother = api.quote.create.useMutation({
    onSuccess: () => {
      resetPartial();
    },
    onError: (error: { message: any }) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  const resetPartial = () => {
    setText("");
    setPageNumber("");
    setIsImportant(false);
    setResetKey((prev) => prev + 1);
    form.reset({
      text: "",
      pageNumber: "",
      bookId: bookId,
      isImportant: false,
    });
    setResetKey((prev) => prev + 1);
  };

  // Define the schema for quote validation
  const quoteSchema = z.object({
    text: z
      .string()
      .min(1, { message: "Text must be at least 1 character" })
      .max(3000, { message: "Text must be less than 2000 characters" }),
    bookId: z
      .number()
      .min(1, { message: "Book ID must be at least 1" })
      .max(100000, {
        message: "Book ID must be less than 100,000 characters",
      }),
    context: z
      .string()
      .max(2000, { message: "Context must be less than 2000 characters" })
      .regex(stringRegex, {
        message:
          "Context must only contain letters, spaces, parentheses, periods, and hyphens",
      })
      .optional(),
    pageNumber: z
      .string()
      .max(20, { message: "Page Number must be less than 20 characters" })
      .regex(alphanumericRegex, {
        message:
          "Page Number must only contain letters, numbers, spaces, periods, and hyphens",
      })
      .optional(),
    quotedBy: z
      .number()
      .max(100000, {
        message: "Quoted By must be less than 100,000 characters",
      })
      .optional(),
    isImportant: z.boolean(),
    isPrivate: z.boolean(),
    authorIds: z
      .array(z.number())
      .max(100000, {
        message: "Author ID must be less than 100,000 characters",
      })
      .optional(),
    topicIds: z
      .array(z.number())
      .max(100000, {
        message: "Topic ID must be less than 100,000 characters",
      })
      .optional(),
    tagIds: z
      .array(z.number())
      .max(100000, {
        message: "Tag ID must be less than 100,000 characters",
      })
      .optional(),
    typeIds: z
      .array(z.number())
      .max(100000, {
        message: "Type ID must be less than 100,000 characters",
      })
      .optional(),
  });

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      text: "",
      bookId: 0,
      context: "",
      pageNumber: "",
      quotedBy: undefined,
      isImportant: false,
      isPrivate: false,
      topicIds: [],
      tagIds: [],
      typeIds: [],
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof quoteSchema>) => {
    const mutationValues = {
      ...values,
      topicIds: selectedTopicIds,
      tagIds: selectedTagIds,
      typeIds: selectedTypeIds,
    };

    createQuote.mutate(mutationValues);
  };

  // Function to handle form submission and add another
  const submitAndResetPartial = (values: z.infer<typeof quoteSchema>) => {
    const mutationValues = {
      ...values,
      topicIds: selectedTopicIds,
      tagIds: selectedTagIds,
      typeIds: selectedTypeIds,
    };

    createQuoteAndAddAnother.mutate(mutationValues);
  };

  // Function to toggle selection of items in the popover
  type ArrayFieldNames = "topicIds" | "tagIds" | "typeIds";
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
        <div className="flex w-full flex-col gap-6">
          {/* Quote Text Field */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Quote</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Quote text"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The quote text.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6">
          {/* Quote Context Field */}
          <FormField
            control={form.control}
            name="context"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">
                  Quote&apos;s Context
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    rows={2}
                    placeholder="Quote context"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The quote&apos;s context.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Quote Page Number Field */}
          <FormField
            // TODO: DOES NOT RESET ON SUBMIT
            control={form.control}
            name="pageNumber"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col md:w-1/3">
                <FormLabel className="font-bold">Page Number</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input type="text" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The quote&apos;s page number.</FormDescription>
              </FormItem>
            )}
          />
          {/* Quote Author Field */}
          <FormField
            control={form.control}
            name="isImportant"
            render={({ field }) => (
              <FormItem className="flex w-full flex-row items-center space-x-3 space-y-0 md:w-1/3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Important Quote?</FormLabel>
                  <FormDescription>
                    Check this box if this quote is very important to you.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {/* Quote Private Field */}
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-row items-center space-x-3 space-y-0 md:w-1/3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Private Quote?</FormLabel>
                  <FormDescription>
                    Check this box if this quote is private.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Quote Book Field */}
          <FormField
            key={`book-select-${resetKey}`}
            control={form.control}
            name="bookId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Book</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setBookId(Number(value));
                    field.onChange(Number(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getBooks.data?.map((book: any) => (
                      <SelectItem
                        key={book.id}
                        value={book.id.toString()}
                        onClick={() => {
                          setBookId(book.id);
                        }}
                      >
                        {book.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The book the quote is from.</FormDescription>
              </FormItem>
            )}
          />
          {/* Quote Author Field */}
          <FormField
            control={form.control}
            name="quotedBy"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Quoted Author</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setQuotedBy(Number(value));
                    field.onChange(Number(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getAuthors.data?.map((author: any) => (
                      <SelectItem key={author.id} value={author.id.toString()}>
                        {author.firstName} {author.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The author who is being quoted.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Quote Topic Field */}
          <FormField
            control={form.control}
            name="topicIds"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Topic(s)</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Popover
                  open={isTopicPopoverOpen}
                  onOpenChange={setIsTopicPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        role="combobox"
                        aria-expanded={isTopicPopoverOpen}
                      >
                        Select Topic(s)
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search topics"
                        className="rounded"
                      />
                      <CommandList>
                        <CommandEmpty>No topics found.</CommandEmpty>
                        <CommandGroup>
                          {getTopics.data?.map((topic: any) => (
                            <CommandItem
                              key={topic.id}
                              className="cursor-pointer"
                              onSelect={() => {
                                toggleSelection(
                                  topic.id,
                                  selectedTopicIds,
                                  setSelectedTopicIds,
                                  "topicIds",
                                );
                              }}
                            >
                              <div className="flex w-full items-center justify-between">
                                {topic.name}
                                <Checkbox
                                  checked={selectedTopicIds.includes(topic.id)}
                                  onCheckedChange={() => {
                                    toggleSelection(
                                      topic.id,
                                      selectedTopicIds,
                                      setSelectedTopicIds,
                                      "topicIds",
                                    );
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
                  The topic(s) the quote is about.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Quote Tag Field */}
          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Tag(s)</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Popover
                  open={isTagPopoverOpen}
                  onOpenChange={setIsTagPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        role="combobox"
                        aria-expanded={isTopicPopoverOpen}
                      >
                        Select Tag(s)
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search tags"
                        className="rounded"
                      />
                      <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandGroup>
                          {getTags.data?.map((tag: any) => (
                            <CommandItem
                              key={tag.id}
                              className="cursor-pointer"
                              onSelect={() => {
                                toggleSelection(
                                  tag.id,
                                  selectedTagIds,
                                  setSelectedTagIds,
                                  "tagIds",
                                );
                              }}
                            >
                              <div className="flex w-full items-center justify-between">
                                {tag.name}
                                <Checkbox
                                  checked={selectedTagIds.includes(tag.id)}
                                  onCheckedChange={() => {
                                    toggleSelection(
                                      tag.id,
                                      selectedTagIds,
                                      setSelectedTagIds,
                                      "tagIds",
                                    );
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
                  The tag(s) the quote is about.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* Quote Type Field */}
          <FormField
            control={form.control}
            name="typeIds"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Type(s)</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Popover
                  open={isTypePopoverOpen}
                  onOpenChange={setIsTypePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        role="combobox"
                        aria-expanded={isTopicPopoverOpen}
                      >
                        Select Type(s)
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="" side="bottom" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search types"
                        className="rounded"
                      />
                      <CommandList>
                        <CommandEmpty>No types found.</CommandEmpty>
                        <CommandGroup>
                          {getTypes.data?.map((type: any) => (
                            <CommandItem
                              key={type.id}
                              className="cursor-pointer"
                              onSelect={() => {
                                toggleSelection(
                                  type.id,
                                  selectedTypeIds,
                                  setSelectedTypeIds,
                                  "typeIds",
                                );
                              }}
                            >
                              <div className="flex w-full items-center justify-between">
                                {type.name}
                                <Checkbox
                                  checked={selectedTypeIds.includes(type.id)}
                                  onCheckedChange={() => {
                                    toggleSelection(
                                      type.id,
                                      selectedTypeIds,
                                      setSelectedTypeIds,
                                      "typeIds",
                                    );
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
                  The type(s) the quote is about.
                </FormDescription>
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
        <Button
          onClick={form.handleSubmit(submitAndResetPartial)}
          className="border-1 rounded border bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Another Quote
        </Button>
      </form>
    </Form>
  );
}
