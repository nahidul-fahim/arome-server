import { z } from "zod";

// Create product validation
const createProductValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),

    price: z.number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    }).positive({ message: "Price must be greater than 0" }),

    categoryId: z.string({
      required_error: "Category ID is required",
      invalid_type_error: "Category ID must be a string",
    }),

    inventory: z.number({
      required_error: "Inventory is required",
      invalid_type_error: "Inventory must be a number",
    }).nonnegative({ message: "Inventory must be 0 or more" }),

    description: z.string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    }),

    discount: z
      .number({
        invalid_type_error: "Discount must be a number",
      })
      .min(0, { message: "Discount must be 0 or more" })
      .optional()
  }),
});

// Update product validation
const updateProductValidation = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .optional(),

    price: z
      .number({
        invalid_type_error: "Price must be a number",
      })
      .positive({ message: "Price must be greater than 0" })
      .optional(),

    categoryId: z
      .string({
        invalid_type_error: "Category ID must be a string",
      })
      .optional(),

    inventory: z
      .number({
        invalid_type_error: "Inventory must be a number",
      })
      .nonnegative({ message: "Inventory must be 0 or more" })
      .optional(),

    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),

    discount: z
      .number({
        invalid_type_error: "Discount must be a number",
      })
      .nonnegative({ message: "Discount must be 0 or more" })
      .optional()
  }),
});

export const ProductValidation = {
  createProductValidation,
  updateProductValidation,
};
