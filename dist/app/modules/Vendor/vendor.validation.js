"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorValidation = void 0;
const zod_1 = require("zod");
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        shopName: zod_1.z.string({
            invalid_type_error: "Shop name must be a string",
            required_error: "Shop name is required",
        }).min(1, { message: "Shop name cannot be empty" }).optional(),
        description: zod_1.z.string({
            invalid_type_error: "Description must be a string",
            required_error: "Description is required",
        }).optional(),
    })
});
exports.VendorValidation = {
    updateValidation
};
