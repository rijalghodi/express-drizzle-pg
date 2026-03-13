import { Router } from "express";

import TodoController from "@/controllers/todo.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/", authMiddleware, TodoController.createTodo);
router.get("/", authMiddleware, TodoController.getUserTodos);
router.put("/:id", authMiddleware, TodoController.updateTodo);
router.delete("/:id", authMiddleware, TodoController.deleteTodo);

export default router;
