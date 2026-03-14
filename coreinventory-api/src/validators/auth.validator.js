import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .email("Invalid email address")
      .transform((value) => value.toLowerCase().trim()),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long")
  })
});

export const signInSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .transform((value) => value.toLowerCase().trim()),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});
