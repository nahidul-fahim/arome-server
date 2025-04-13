"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopValidation = void 0;
const zod_1 = require("zod");
const createShopValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Shop name is required",
            invalid_type_error: "Shop name must be a string",
        }).min(1, { message: "Shop name cannot be empty" }),
        description: zod_1.z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }).min(1, { message: "Description cannot be empty" }),
        vendorId: zod_1.z.string({
            required_error: "Vendor ID is required",
            invalid_type_error: "Vendor ID must be a string",
        })
    }),
});
exports.ShopValidation = {
    createShopValidation
};
