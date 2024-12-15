import { z } from "zod";

const updateValidation = z.object({
  body: z.object({
    shopName: z.string({
      invalid_type_error: "Shop name must be a string",
      required_error: "Shop name is required",
    }).min(1, { message: "Shop name cannot be empty" }).optional(),

    description: z.string({
      invalid_type_error: "Description must be a string",
      required_error: "Description is required",
    }).optional(),
  })
});


export const VendorValidation = {
  updateValidation
}