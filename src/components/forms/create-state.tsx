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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function CreateState() {
  const router = useRouter();

  // Use React state hooks for managing form state
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [countryId, setCountryId] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  // Fetch all countries using a query
  const allCountries = api.country.getAll.useQuery();

  // Function to reset form and state
  const resetFormAndState = () => {
    setName("");
    setAbbreviation("");
    setCountryId(0);
    form.reset({
      name: "",
      abbreviation: "",
      countryId: 0,
    });
    setResetKey((prev) => prev + 1);
  };

  // Define the createState mutation
  const createState = api.state.create.useMutation({
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

  // Define the state schema using Zod
  const stateSchema = z.object({
    name: z
      .string()
      .min(1, { message: "State name must be at least 1 character." })
      .max(255, { message: "State name must be less than 255 characters." })
      .regex(stringRegex, {
        message:
          "State name must only contain letters, spaces, and the following characters: - . ( )",
      }),
    abbreviation: z
      .string()
      .min(1, { message: "State abbreviation must be at least 1 character." })
      .max(255, {
        message: "State abbreviation must be less than 255 characters.",
      })
      .regex(stringRegex, {
        message:
          "State abbreviation must only contain letters, spaces, and the following characters: - . ( )",
      }),
    countryId: z.number(),
  });

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof stateSchema>>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof stateSchema>) => {
    createState.mutate(values);
    toast({
      title: "Success!",
      description: "State created successfully.",
    });
    resetFormAndState();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex w-full flex-col gap-6"
      >
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* State Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">State&apos;s Name</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="State" className="rounded" {...field} />
                </FormControl>
                <FormDescription className="text-sm">
                  The state&apos;s name.
                </FormDescription>
              </FormItem>
            )}
          />
          {/* State Abbreviation Field */}
          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">
                  State&apos;s Abbreviation
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="State" className="rounded" {...field} />
                </FormControl>
                <FormDescription className="text-sm">
                  The state&apos;s abbreviation.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* Country Select Field */}
          <FormField
            key={`country-select-${resetKey}`}
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Country</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allCountries.data?.map((country: any) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                        onClick={() => {
                          setCountryId(Number(country.id));
                        }}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-sm">
                  The country the state belongs to.
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
  );
}
