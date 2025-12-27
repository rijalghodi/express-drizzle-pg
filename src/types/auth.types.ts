import { z } from "zod";

import { loginSchema, registerSchema } from "../validators/auth.schema";

export type AuthUserData = {
  email?: string;
  userId?: string;
};

export type RegisterUserDTO = z.infer<typeof registerSchema>;

export type LoginUserDTO = z.infer<typeof loginSchema>;

export type RegisterUserResponseDTO = {
  message: string;
  token: string;
};

export type LoginUserResponseDTO = RegisterUserResponseDTO;
