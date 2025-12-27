import { z } from "zod";

import { todoSchema, updateTodoSchema } from "../validators/todo.schema";

export type CreateTodoRequestDTO = z.infer<typeof todoSchema>;

export type UpdateTodoRequestDTO = z.infer<typeof updateTodoSchema>;

export type CreateTodoResponseDTO = {
  message: string;
  todo: CreateTodoRequestDTO & { id: string; userId: string; status: boolean };
};

export type TodoResponseDTO = {
  message: string;
  todos: CreateTodoRequestDTO[] & { id: string; userId: string; status: boolean }[];
};

export type UpdateTodoResponseDTO = {
  message: string;
  todo: CreateTodoRequestDTO & { id: string; userId: string; status: boolean };
};
