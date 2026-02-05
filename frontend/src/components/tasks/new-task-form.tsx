"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800">Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add task details..." {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white font-bold py-6 text-base shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-2"
              >
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Creating...
              </motion.div>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Create Task
              </span>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
