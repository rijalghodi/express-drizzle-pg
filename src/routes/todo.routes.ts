import { Router } from "express";

import { todoController } from "@/controllers/todo.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/", authMiddleware, todoController.createTodo);
router.get("/", authMiddleware, todoController.getUserTodos);
router.put("/:id", authMiddleware, todoController.updateTodo);
router.delete("/:id", authMiddleware, todoController.deleteTodo);

export { router as todoRoutes };
