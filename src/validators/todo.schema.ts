import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Title must be atleast 1 characters long"),
  description: z.string().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.boolean().optional(),
});
