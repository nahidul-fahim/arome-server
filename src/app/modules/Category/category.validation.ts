import { z } from "zod";

const createValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: "Name must be a string",
      required_error: "Name is required",
    }).min(1, { message: "Name cannot be empty" }),

    description: z.string({
      invalid_type_error: "Description must be a string",
    }).optional(),
  })
});

export const CategoryValidation = {
  createValidation
}