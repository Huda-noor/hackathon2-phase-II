"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TaskCreateDTO } from "@/lib/validations/task";
import { tasksService } from "@/lib/api/tasks";
import { auth } from "@/lib/auth";

interface NewTaskFormProps {
  onTaskCreated: () => void;
}

export function NewTaskForm({ onTaskCreated }: NewTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = auth.getUser();

  const form = useForm<z.infer<typeof TaskCreateDTO>>({
    resolver: zodResolver(TaskCreateDTO),
    defaultValues: {
      title: "",
      description: "",
      status: "Todo",
      owner_id: currentUser?.id || "",
    },
  });

  async function onSubmit(values: z.infer<typeof TaskCreateDTO>) {
    setIsLoading(true);
    try {
      await tasksService.createTask(values);
      toast.success("Task created successfully!");
      form.reset({
        title: "",
        description: "",
        status: "Todo",
        owner_id: currentUser?.id || "",
      });
      onTaskCreated();
    } catch (error: any) {
      toast.error(error.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add task details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
