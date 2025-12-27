import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters long"),
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});
