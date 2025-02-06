import { z } from "zod";

// Create Cart Validation
const createCartValidation = z.object({
    body: z.object({
        customerId: z.string({
            required_error: "Customer ID is required",
            invalid_type_error: "Customer ID must be a string",
        }),

        cartItem: z
            .array(
                z.object({
                    productId: z.string({
                        required_error: "Product ID is required",
                        invalid_type_error: "Product ID must be a string",
                    }),
                    quantity: z
                        .number({
                            required_error: "Quantity is required",
                            invalid_type_error: "Quantity must be a number",
                        })
                        .positive({ message: "Quantity must be greater than 0" }),
                })
            )
            .min(1, { message: "At least one cart item is required" }),
    }),
});

// Update Cart Validation
const updateCartValidation = z.object({
    body: z.object({
        customerId: z.string({
            required_error: "Customer ID is required",
            invalid_type_error: "Customer ID must be a string",
        }),

        cartItem: z
            .array(
                z.object({
                    productId: z.string({
                        invalid_type_error: "Product ID must be a string",
                    })
                        .optional(),
                    quantity: z
                        .number({
                            invalid_type_error: "Quantity must be a number",
                        })
                        .positive({ message: "Quantity must be greater than 0" })
                        .optional(),
                })
            )
            .optional(),
    }),
});

export const CartValidation = {
    createCartValidation,
    updateCartValidation,
};