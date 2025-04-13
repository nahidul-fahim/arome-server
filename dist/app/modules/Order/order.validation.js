"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createShippingDetailsValidation = zod_1.z.object({
    address: zod_1.z.string({
        required_error: "Address is required",
        invalid_type_error: "Address must be a string",
    }),
    phone: zod_1.z.string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string",
    }),
    email: zod_1.z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }).email({
        message: "Invalid email address",
    }),
    cityId: zod_1.z.string({
        required_error: "City ID is required",
        invalid_type_error: "City ID must be a string",
    })
});
const updateShippingDetailsValidation = zod_1.z.object({
    body: zod_1.z.object({
        address: zod_1.z.string({
            invalid_type_error: "Address must be a string",
        }).optional(),
        phone: zod_1.z.string({
            invalid_type_error: "Phone number must be a string",
        }).optional(),
        email: zod_1.z.string({
            invalid_type_error: "Email must be a string",
        }).email({
            message: "Invalid email address",
        }).optional(),
        cityId: zod_1.z.string({
            invalid_type_error: "City ID must be a string",
        }).optional()
    })
});
const createOrderValidation = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string({
            required_error: "Customer ID is required",
            invalid_type_error: "Customer ID must be a string",
        }),
        couponId: zod_1.z.string({
            invalid_type_error: "Coupon ID must be a string",
        }).optional(),
        shippingDetails: createShippingDetailsValidation,
    }),
});
exports.OrderValidation = {
    createOrderValidation,
    updateShippingDetailsValidation,
};
