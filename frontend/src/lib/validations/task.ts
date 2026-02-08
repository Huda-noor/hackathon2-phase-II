import * as z from "zod";

export const TaskCreateDTO = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["Todo", "InProgress", "Done"]),
  owner_id: z.string(),
});

export const TaskUpdateDTO = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(["Todo", "InProgress", "Done"]).optional(),
});
