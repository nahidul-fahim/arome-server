"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemValidation = exports.OrderValidation = void 0;
const zod_1 = require("zod");
// Create Order Validation
const createOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string({
            required_error: "Customer ID is required",
            invalid_type_error: "Customer ID must be a string",
        }),
        vendorId: zod_1.z.string({
            required_error: "Vendor ID is required",
            invalid_type_error: "Vendor ID must be a string",
        }),
        status: zod_1.z
            .enum(["PENDING", "COMPLETED", "CANCELLED"], {
            required_error: "Status is required",
            invalid_type_error: "Invalid status value",
        })
            .optional(),
        totalAmount: zod_1.z
            .number({
            required_error: "Total amount is required",
            invalid_type_error: "Total amount must be a number",
        })
            .positive({ message: "Total amount must be greater than 0" }),
        orderItems: zod_1.z
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
            price: zod_1.z
                .number({
                required_error: "Price is required",
                invalid_type_error: "Price must be a number",
            })
                .positive({ message: "Price must be greater than 0" }),
        }))
            .min(1, { message: "At least one order item is required" }),
    }),
});
// Update Order Validation
const updateOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string({
            invalid_type_error: "Customer ID must be a string",
        }).optional(),
        vendorId: zod_1.z.string({
            invalid_type_error: "Vendor ID must be a string",
        }).optional(),
        status: zod_1.z
            .enum(["PENDING", "COMPLETED", "CANCELLED"], {
            invalid_type_error: "Invalid status value",
        })
            .optional(),
        totalAmount: zod_1.z
            .number({
            invalid_type_error: "Total amount must be a number",
        })
            .positive({ message: "Total amount must be greater than 0" })
            .optional(),
        orderItems: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string({
                invalid_type_error: "Product ID must be a string",
            }),
            quantity: zod_1.z
                .number({
                invalid_type_error: "Quantity must be a number",
            })
                .positive({ message: "Quantity must be greater than 0" }),
            price: zod_1.z
                .number({
                invalid_type_error: "Price must be a number",
            })
                .positive({ message: "Price must be greater than 0" }),
        }))
            .optional(),
    }),
});
// Create OrderItem Validation
const createOrderItemValidation = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string({
            required_error: "Order ID is required",
            invalid_type_error: "Order ID must be a string",
        }),
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
        price: zod_1.z
            .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        })
            .positive({ message: "Price must be greater than 0" }),
    }),
});
// Update OrderItem Validation
const updateOrderItemValidation = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string({
            invalid_type_error: "Order ID must be a string",
        }).optional(),
        productId: zod_1.z.string({
            invalid_type_error: "Product ID must be a string",
        }).optional(),
        quantity: zod_1.z
            .number({
            invalid_type_error: "Quantity must be a number",
        })
            .positive({ message: "Quantity must be greater than 0" })
            .optional(),
        price: zod_1.z
            .number({
            invalid_type_error: "Price must be a number",
        })
            .positive({ message: "Price must be greater than 0" })
            .optional(),
    }),
});
exports.OrderValidation = {
    createOrderValidation,
    updateOrderValidation,
};
exports.OrderItemValidation = {
    createOrderItemValidation,
    updateOrderItemValidation,
};
