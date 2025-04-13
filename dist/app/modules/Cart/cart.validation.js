"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartValidation = void 0;
const zod_1 = require("zod");
// Create Cart Validation
const createCartValidation = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string({
            required_error: "Customer ID is required",
            invalid_type_error: "Customer ID must be a string",
        }),
        cartItem: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string({
                required_error: "Product ID is required",
                invalid_type_error: "Product ID must be a string",
            }),
            quantity: zod_1.z
                .number({
                required_error: "Quantity is required",
                invalid_type_error: "Quantity must be a number",
            })
                .positive({ message: "Quantity must be greater than 0" }),
        }))
            .min(1, { message: "At least one cart item is required" }),
    }),
});
// Update Cart Validation
const updateCartValidation = zod_1.z.object({
    body: zod_1.z.object({
        cartItem: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string({
                invalid_type_error: "Product ID must be a string",
            }),
            cartItemId: zod_1.z.string({
                required_error: "Cart item ID is required",
                invalid_type_error: "Cart item ID must be a string",
            }),
            quantity: zod_1.z
                .number({
                invalid_type_error: "Quantity must be a number",
            })
                .positive({ message: "Quantity must be greater than 0" }),
        })),
    }),
});
exports.CartValidation = {
    createCartValidation,
    updateCartValidation,
};
