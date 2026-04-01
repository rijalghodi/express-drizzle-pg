import { Router } from "express";

import { createTodo, deleteTodo, getUserTodos, updateTodo } from "@/controllers/todo.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/", authMiddleware, createTodo);
router.get("/", authMiddleware, getUserTodos);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

export { router as todoRoutes };
