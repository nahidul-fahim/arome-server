"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
// Create product validation
const createProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        }),
        price: zod_1.z.number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        }).positive({ message: "Price must be greater than 0" }),
        categoryId: zod_1.z.string({
            required_error: "Category ID is required",
            invalid_type_error: "Category ID must be a string",
        }),
        inventory: zod_1.z.number({
            required_error: "Inventory is required",
            invalid_type_error: "Inventory must be a number",
        }).nonnegative({ message: "Inventory must be 0 or more" }),
        description: zod_1.z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }),
        discount: zod_1.z
            .number({
            invalid_type_error: "Discount must be a number",
        })
            .min(0, { message: "Discount must be 0 or more" })
            .optional()
    }),
});
// Update product validation
const updateProductValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            invalid_type_error: "Name must be a string",
        })
            .optional(),
        price: zod_1.z
            .number({
            invalid_type_error: "Price must be a number",
        })
            .positive({ message: "Price must be greater than 0" })
            .optional(),
        categoryId: zod_1.z
            .string({
            invalid_type_error: "Category ID must be a string",
        })
            .optional(),
        inventory: zod_1.z
            .number({
            invalid_type_error: "Inventory must be a number",
        })
            .nonnegative({ message: "Inventory must be 0 or more" })
            .optional(),
        description: zod_1.z
            .string({
            invalid_type_error: "Description must be a string",
        })
            .optional(),
        discount: zod_1.z
            .number({
            invalid_type_error: "Discount must be a number",
        })
            .nonnegative({ message: "Discount must be 0 or more" })
            .optional()
    }),
});
exports.ProductValidation = {
    createProductValidation,
    updateProductValidation,
};
