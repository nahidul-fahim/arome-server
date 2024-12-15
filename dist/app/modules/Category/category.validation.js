"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: "Name must be a string",
            required_error: "Name is required",
        }).min(1, { message: "Name cannot be empty" }),
        description: zod_1.z.string({
            invalid_type_error: "Description must be a string",
        }).optional(),
    })
});
exports.CategoryValidation = {
    createValidation
};
