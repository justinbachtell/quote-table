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

// Define the city schema using Zod
const citySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(255, { message: "Name must be less than 255 characters" })
    .regex(stringRegex, {
      message:
        "Name must only contain letters, spaces, parentheses, periods, and hyphens",
    }),
  stateId: z
    .number()
    .max(100000, {
      message: "State ID must be less than 100,000 characters",
    })
    .optional(),
  countryId: z
    .number()
    .min(1, { message: "Country ID must be at least 1" })
    .max(100000, {
      message: "Country ID must be less than 100,000 characters",
    }),
});

export function CreateCity() {
  const router = useRouter();

  // Use React state hooks for managing form state
  const [name, setName] = useState("");
  const [stateId, setStateId] = useState(0);
  const [countryId, setCountryId] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  // Fetch states and countries using trpc queries
  const allStates = api.state.getAll.useQuery();
  const allCountries = api.country.getAll.useQuery();

  // Function to reset the form and state
  const resetFormAndState = () => {
    setName("");
    setStateId(0);
    setCountryId(0);
    form.reset({
      name: "",
      stateId: 0,
      countryId: 0,
    });
    setResetKey((prev) => prev + 1);
  };

  // Define the createCity mutation
  const createCity = api.city.create.useMutation({
    onSuccess: () => {
      router.refresh();
      resetFormAndState();
    },
    onError: (error: { message: any }) => {
      console.error("Failed to create city. ", error);
      toast({
        title: "Error!",
        description: error.message,
      });
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof citySchema>) => {
    createCity.mutate(values);
    toast({
      title: "Success!",
      description: "City created successfully.",
    });
    resetFormAndState();
  };

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof citySchema>>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      stateId: 0,
      countryId: 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex w-full flex-col gap-6"
      >
        {/* Name and Country Fields  */}
        <div className="flex w-full flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">City&apos;s Name</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Name" className="rounded" {...field} />
                </FormControl>
                <FormDescription className="text-sm">
                  The city&apos;s name.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* State Select Field */}
          <FormField
            key={`state-select-${resetKey}`}
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">State</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setStateId(Number(value));
                    field.onChange(Number(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allStates.data?.map((state: any) => (
                      <SelectItem
                        key={state.id}
                        value={state.id.toString()}
                        onClick={() => {
                          setStateId(Number(state.id));
                        }}
                      >
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-sm">
                  The state the city is in.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            key={`country-select-${resetKey}`}
            control={form.control}
            name="countryId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Country</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setCountryId(Number(value));
                    field.onChange(Number(value));
                  }}
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
                  The country the city is in.
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
