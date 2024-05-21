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

export function CreatePublisher() {
  const router = useRouter();

  // Use React state hooks for managing form state
  const [name, setName] = useState("");
  const [cityId, setCityId] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  // Fetch all cities using tRPC query
  const allCities = api.city.getAll.useQuery();

  // Function to reset form and state
  const resetFormAndState = () => {
    setName("");
    setCityId(0);
    form.reset({
      name: "",
      cityId: 0,
    });
    setResetKey((prev) => prev + 1);
  };

  // Define the createPublisher mutation
  const createPublisher = api.publisher.create.useMutation({
    onSuccess: () => {
      router.refresh();
      resetFormAndState();
    },
    onError: (error: { message: any }) => {
      toast({
        title: "Error!",
        description:
          error.message || "An error occurred while creating the publisher.",
      });
    },
  });

  // Define the publisher schema using Zod
  const publisherSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name must be at least 1 character" })
      .max(255, { message: "Name must be less than 255 characters" })
      .regex(stringRegex, {
        message:
          "Name must only contain letters, spaces, parentheses, periods, and hyphens",
      }),
    cityId: z
      .number()
      .min(1, { message: "City ID must be at least 1" })
      .max(100000, {
        message: "City ID must be less than 100,000 characters",
      }),
    stateId: z.number().optional(),
    countryId: z.number().optional(),
    bookIds: z.array(z.number()).optional(),
    authorIds: z.array(z.number()).optional(),
  });

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof publisherSchema>>({
    resolver: zodResolver(publisherSchema),
    defaultValues: {
      name: "",
      cityId: 0,
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof publisherSchema>) => {
    const mutationValues = {
      ...values,
      stateId: values.stateId ?? undefined,
      countryId: values.countryId ?? undefined,
    };

    createPublisher.mutate(mutationValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col gap-6"
      >
        <div className="flex w-full flex-col gap-6">
          {/* Publisher Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">
                  Publisher&apos;s Name
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Name" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The publisher&apos;s name.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-4">
          {/* City Selection Field */}
          <FormField
            key={`city-select-${resetKey}`}
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">City</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <Select
                  onValueChange={(value) => {
                    setCityId(Number(value));
                    field.onChange(Number(value));
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="rounded">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allCities.data?.map((city: any) => (
                      <SelectItem
                        key={city.id}
                        value={city.id.toString()}
                        onClick={() => {
                          setCityId(Number(city.id));
                        }}
                      >
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-sm">
                  The city where the publisher is located.
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
