import { and, eq } from "drizzle-orm";

import { db } from "@/config/drizzle.client";
import { todosTable } from "@/db/schema";
import { CreateTodoRequestDTO, UpdateTodoRequestDTO } from "@/types/todo.types";

const createTodo = async (userId: string, todoData: CreateTodoRequestDTO) => {
  const [todo] = await db
    .insert(todosTable)
    .values({
      userId,
      title: todoData.title,
      description: todoData.description,
      status: false,
    })
    .returning();
  return todo;
};

const getUserTodos = async (userId: string) => {
  return db.select().from(todosTable).where(eq(todosTable.userId, userId));
};

const updateTodo = async (userId: string, todoId: string, todoData: UpdateTodoRequestDTO) => {
  const [todo] = await db
    .update(todosTable)
    .set({
      title: todoData.title,
      description: todoData.description,
      status: todoData.status,
    })
    .where(and(eq(todosTable.id, todoId), eq(todosTable.userId, userId)))
    .returning();
  return todo;
};

const deleteTodo = async (userId: string, todoId: string) => {
  const [todo] = await db
    .delete(todosTable)
    .where(and(eq(todosTable.id, todoId), eq(todosTable.userId, userId)))
    .returning();
  return todo;
};

export { createTodo, deleteTodo, getUserTodos, updateTodo };
