import { z } from "zod";

import { todoSchema, updateTodoSchema } from "../validators/todo.schema";

export type CreateTodoRequestDTO = z.infer<typeof todoSchema>;

export type UpdateTodoRequestDTO = z.infer<typeof updateTodoSchema>;

export type TodoResponseDTO = {
  id: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export type CreateTodoResponseDTO = TodoResponseDTO;

export type UpdateTodoResponseDTO = TodoResponseDTO;
