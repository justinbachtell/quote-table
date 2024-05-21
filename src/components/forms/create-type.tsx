"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@/trpc/react";

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

export function CreateType() {
  const router = useRouter();

  // Use React state hooks for managing form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [resetKey, setResetKey] = useState(0);

  // Function to reset form and state
  const resetFormAndState = () => {
    setName("");
    setDescription("");
    form.reset({
      name: "",
      description: "",
    });
    setResetKey((key) => key + 1);
  };

  // Define the createType mutation
  const createType = api.type.create.useMutation({
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

  // Define the type schema using Zod
  const typeSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Type name must be at least 1 character." })
      .max(255, { message: "Type name must be less than 255 characters." }),
    description: z
      .string()
      .min(1, { message: "Type description must be at least 1 character." })
      .max(255, {
        message: "Type description must be less than 255 characters.",
      }),
  });

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof typeSchema>>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof typeSchema>) => {
    const mutationValues = {
      ...values,
    };

    createType.mutate(mutationValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col gap-6"
      >
        <div className="flex w-full flex-col gap-6">
          {/* Type Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Type&apos;s Name</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Name" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The type&apos;s name.</FormDescription>
              </FormItem>
            )}
          />
          {/* Type Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">
                  Type&apos;s Description
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The type&apos;s description.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        {/* Separator */}
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
