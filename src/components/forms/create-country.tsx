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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Define the country schema using Zod
const countrySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Country name must be at least 1 character." })
    .max(255, { message: "Country name must be less than 255 characters." })
    .regex(stringRegex, {
      message:
        "Country name must only contain letters, spaces, parentheses, periods, and hyphens.",
    }),
  stateIds: z.array(z.number()).optional(),
  cityIds: z.array(z.number()).optional(),
});

export function CreateCountry() {
  const router = useRouter();

  // Use React state hooks for managing form state
  const [name, setName] = useState("");

  // Define the createCountry mutation
  const createCountry = api.country.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof countrySchema>) => {
    createCountry.mutate(values);
    toast({
      title: "Success!",
      description: "Country created successfully.",
    });
    form.reset();
  };

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof countrySchema>>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col gap-6"
      >
        {/* Country Name */}
        <div className="flex w-full flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Country&apos;s Name</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Name" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The country&apos;s name.</FormDescription>
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
