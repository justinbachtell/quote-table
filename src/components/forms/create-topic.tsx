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

export function CreateTopic() {
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

  // Define the createTopic mutation
  const createTopic = api.topic.create.useMutation({
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

  // Define the topic schema using Zod
  const topicSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Topic name must be at least 1 character." })
      .max(255, { message: "Topic name must be less than 255 characters." })
      .regex(stringRegex, {
        message:
          "Topic name must only contain letters, spaces, parentheses, periods, and hyphens.",
      }),
    description: z.string().max(255, {
      message: "Topic description must be less than 255 characters.",
    }),
  });

  // Initialize the form using react-hook-form
  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof topicSchema>) => {
    const mutationValues = {
      ...values,
    };

    createTopic.mutate(mutationValues);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex flex-col gap-6"
      >
        <div className="flex w-full flex-col gap-6">
          {/* Topic Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">Topic&apos;s Name</FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Input placeholder="Name" className="rounded" {...field} />
                </FormControl>
                <FormDescription>The topic&apos;s name.</FormDescription>
              </FormItem>
            )}
          />
          {/* Topic Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-bold">
                  Topic&apos;s Description
                </FormLabel>
                <FormMessage className="space-y-0 text-red-600" />
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="rounded"
                    {...field}
                  />
                </FormControl>
                <FormDescription>The topic&apos;s description.</FormDescription>
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
