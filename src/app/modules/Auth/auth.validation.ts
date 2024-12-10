import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    email: z.string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    }).email({ message: "Invalid email format" }),

    password: z.string({
      invalid_type_error: "Password must be a string",
      required_error: "Password date is required",
    }),
  })
});

export const AuthValidation = {
  loginValidation
}