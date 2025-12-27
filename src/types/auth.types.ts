import { z } from "zod";

import { loginSchema, registerSchema } from "../validators/auth.schema";

export type AuthUserData = {
  email?: string;
  userId?: string;
};

export type RegisterUserDTO = z.infer<typeof registerSchema>;

export type LoginUserDTO = z.infer<typeof loginSchema>;

export type RegisterUserResponseDTO = {
  token: string;
} & GetUserResponseDTO;

export type LoginUserResponseDTO = RegisterUserResponseDTO;

export type GetUserResponseDTO = {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  image: string | null;
};
