import { Request, Response } from "express";

import { todoService } from "@/services/todo.service";
import {
  CreateTodoRequestDTO,
  CreateTodoResponseDTO,
  TodoResponseDTO,
  UpdateTodoRequestDTO,
  UpdateTodoResponseDTO,
} from "@/types/todo.types";
import { todoSchema, updateTodoSchema } from "@/validators/todo.schema";

const createTodo = async (
  req: Request<object, object, CreateTodoRequestDTO>,
  res: Response<CreateTodoResponseDTO>
): Promise<void> => {
  try {
    //Check if user is authenticated / has valid token
    if (!req.authUser) {
      res.error("Unauthorized", 401);
      return;
    }

    const { success, data, error } = todoSchema.safeParse(req.body);

    if (!success) {
      res.error("Invalid request body", 400, error.issues);
      return;
    }

    const { title, description } = data;

    const userId = req.authUser.userId; //userId which is parsed from auth middleware and stored in req.authUser

    const newtodo = await todoService.createTodo(userId, {
      title,
      description,
    });

    res.success(newtodo);
    return;
  } catch (_error) {
    res.error("Error creating todo", 500);
    return;
  }
};

const getUserTodos = async (req: Request, res: Response<TodoResponseDTO[]>): Promise<void> => {
  try {
    //Check if user is authenticated / has valid token
    if (!req.authUser) {
      res.error("Unauthorized", 401);
      return;
    }

    const userId: string = req.authUser.userId; //userId which is parsed from auth middleware and stored in req.authUser

    const todos = await todoService.getUserTodos(userId);

    res.paginated(todos, { page: 1, pageSize: 10, total: 100 });
    return;
  } catch (_error) {
    res.error("Error fetching todos", 500);
    return;
  }
};

const updateTodo = async (
  req: Request<{ id: string }, object, UpdateTodoRequestDTO>,
  res: Response<UpdateTodoResponseDTO>
): Promise<void> => {
  try {
    //Check if user is authenticated / has valid token
    if (!req.authUser) {
      res.error("Unauthorized", 401);
      return;
    }

    const { success, data, error } = updateTodoSchema.safeParse(req.body);

    if (!success) {
      res.error("Invalid request body", 400, error.issues);
      return;
    }

    const { title, description, status } = data;
    const userId: string = req.authUser.userId; //userId which is parsed from auth middleware and stored in req.authUser

    const updatedTodo = await todoService.updateTodo(userId, req.params.id, {
      title,
      description,
      status,
    });

    if (!updatedTodo) {
      res.error("Todo not found", 404);
      return;
    }

    res.success(updatedTodo);
    return;
  } catch (_error) {
    res.error("Error updating todo", 500);
    return;
  }
};

const deleteTodo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    if (!req.authUser) {
      res.error("Unauthorized", 401);
      return;
    }

    const userId: string = req.authUser.userId; //userId which is parsed from auth middleware and stored in req.authUser
    const deletedTodo = await todoService.deleteTodo(userId, req.params.id);

    if (!deletedTodo) {
      res.error("Todo not found", 404);
      return;
    }

    res.success(null, 200, "Todo deleted successfully");
    return;
  } catch (_error) {
    res.error("Error deleting todo", 500);
    return;
  }
};

export const todoController = {
  createTodo,
  getUserTodos,
  updateTodo,
  deleteTodo,
};
