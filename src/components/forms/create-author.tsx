"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";
import { stringRegex } from "@/lib/utils";

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
import { toast } from "@/components/ui/use-toast";

// Define a function component for CreateAuthor
export function CreateAuthor() {
  // Initialize the router
  const router = useRouter();

  // Initialize state variables for author properties
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthYear, setBirthYear] = useState(0);
  const [deathYear, setDeathYear] = useState(0);
  const [nationality, setNationality] = useState("");
  const [biography, setBiography] = useState("");
  const [resetKey, setResetKey] = useState(0);

  // Reset form and state values
  const resetFormAndState = () => {
    // Reset state variables
    setFirstName("");
    setLastName("");
    setBirthYear(0);
    setDeathYear(0);
    setNationality("");
    setBiography("");
    // Reset form values
    form.reset({
      firstName: "",
      lastName: "",
      birthYear: undefined,
      deathYear: undefined,
      nationality: "",
      biography: "",
    });
    // Increment resetKey to trigger form reset
    setResetKey((key) => key + 1);
  };

  // Create an author using TRPC mutation
  const createAuthor = api.author.create.useMutation({
    onSuccess: () => {
      // Refresh the router to update the page
      router.refresh();
      // Reset the form and state
      resetFormAndState();
    },
  });

  // Calculate the current year
  const currentYear = new Date().getFullYear();

  // Check if a year is valid
  const isValidYear = (year: number | undefined) => {
    if (year === undefined) return true;
    const numericYear = Number(year);
    return (
      !isNaN(numericYear) && numericYear >= 1 && numericYear <= currentYear
    );
  };

  // Define a Zod schema for author data
  const authorSchema = z.object({
    firstName: z
      .string()
      .min(1, { message: "Name must be at least 1 character." })
      .max(255, { message: "Name must be less than 70 characters." })
      .regex(stringRegex, {
        message:
          "First name must only contain letters, spaces, parentheses, periods, and hyphens.",
      }),
    lastName: z
      .string()
      .min(1, { message: "Name must be at least 1 character." })
      .max(255, { message: "Name must be less than 70 characters." })
      .regex(stringRegex, {
        message:
          "Name must only contain letters, spaces, parentheses, periods, and hyphens.",
      }),
    birthYear: z
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
    deathYear: z
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
    nationality: z
      .string()
      .min(1, {
        message: "Nationality must be at least 1 character.",
      })
      .max(150, {
        message: "Nationality must be less than 150 characters.",
      })
      .regex(stringRegex, {
        message:
          "Nationality must only contain letters, spaces, parentheses, periods, and hyphens.",
      })
      .optional(),
    biography: z
      .string()
      .max(255, {
        message: "Biography must be less than 255 characters.",
      })
      .regex(stringRegex, {
        message:
          "Biography must only contain letters, spaces, parentheses, periods, and hyphens.",
      })
      .optional(),
    bookIds: z.array(z.number()).optional(),
    quoteIds: z.array(z.number()).optional(),
    topicIds: z.array(z.number()).optional(),
    tagIds: z.array(z.number()).optional(),
    typeIds: z.array(z.number()).optional(),
  });

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof authorSchema>>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthYear: undefined,
      deathYear: undefined,
      nationality: "",
      biography: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof authorSchema>) => {
    const parsedBirthYear = values.birthYear ? Number(values.birthYear) : 0;
    const parsedDeathYear = values.deathYear ? Number(values.deathYear) : 0;

    const mutationValues = {
      ...values,
      birthYear: isNaN(parsedBirthYear) ? 0 : parsedBirthYear,
      deathYear: isNaN(parsedDeathYear) ? 0 : parsedDeathYear,
    };

    // Call the createAuthor mutation
    createAuthor.mutate(mutationValues, {
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Author created successfully.",
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="my-8 flex flex-col gap-6"
        >
          <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
            {/* First Name and Last Name Fields */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col md:w-1/2">
                  <FormLabel className="font-bold">First Name</FormLabel>
                  <FormMessage className="space-y-0 text-red-600" />
                  <FormControl>
                    <Input
                      placeholder="First name"
                      className="rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The author&apos;s first name.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col md:w-1/2">
                  <FormLabel className="font-bold">Last Name</FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      className="rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The author&apos;s last name.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
            {/* Birth Year Field */}
            <FormField
              control={form.control}
              name="birthYear"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col md:w-1/3">
                  <FormLabel className="font-bold">Birth Year</FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input type="number" className="rounded" {...field} />
                  </FormControl>
                  <FormDescription>
                    The author&apos;s year of birth.
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Death Year Field */}
            <FormField
              control={form.control}
              name="deathYear"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col md:w-1/3">
                  <FormLabel className="font-bold">Death Year</FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input type="number" className="rounded" {...field} />
                  </FormControl>
                  <FormDescription>
                    The author&apos;s year of death.
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Nationality Field */}
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col md:w-1/3">
                  <FormLabel className="font-bold">Nationality</FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      type="textarea"
                      placeholder="Nationality"
                      className="rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The author&apos;s nationality.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-6">
            {/* Biography */}
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="font-bold">Biography</FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Textarea
                      placeholder="Author's biography"
                      className="rounded"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The author&apos;s biography.
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
        </form>
      </Form>
    </>
  );
}
