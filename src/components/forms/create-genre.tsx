"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";
import { stringRegex } from "@/lib/utils";

import { toast } from "@/components/ui/use-toast";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Define the genre schema using Zod
const genreSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Genre name must be at least 1 character." })
    .max(255, { message: "Genre name must be less than 255 characters." })
    .regex(stringRegex, {
      message:
        "Genre name must only contain letters, spaces, parentheses, periods, and hyphens.",
    }),
  description: z
    .string()
    .min(1, { message: "Genre description must be at least 1 character." })
    .max(255, {
      message: "Genre description must be less than 255 characters.",
    })
    .regex(stringRegex, {
      message:
        "Genre description must only contain letters, spaces, parentheses, periods, and hyphens.",
    }),
});

export function CreateGenre() {
  const router = useRouter();

  // Use React state hooks for managing form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Define the createGenre mutation
  const createGenre = api.genre.create.useMutation({
    onSuccess: () => {
      router.refresh();
      resetFormAndState();
    },
    onError: (error: { message: any }) => {
      toast({
        title: "Error!",
        description: error.message,
      });
    },
  });

  // Function to reset form and state
  const resetFormAndState = () => {
    setName("");
    setDescription("");
    form.reset({
      name: "",
      description: "",
    });
  };

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof genreSchema>>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof genreSchema>) => {
    const mutationValues = {
      ...values,
    };

    createGenre.mutate(mutationValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col gap-6"
      >
        <div className="flex w-full flex-col gap-6">
          {/* Genre Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Genre&apos;s Name</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Name" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The genre&apos;s name.</FormDescription>
              </FormItem>
            )}
          />
          {/* Genre Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">
                  Genre&apos;s Description
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The genre&apos;s description.</FormDescription>
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
