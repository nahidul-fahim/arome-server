import { z } from "zod";

const userValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    }).min(1, { message: "Name cannot be empty" }),

    email: z.string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    }).email({ message: "Invalid email format" }),

    password: z.string({
      invalid_type_error: "Password must be a string",
      required_error: "Password date is required",
    }).min(6, { message: "Password must be at least 6 characters long" }),
  })
});


export const UserControllerValidation = {
  userValidation
}