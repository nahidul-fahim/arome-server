"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllerValidation = void 0;
const zod_1 = require("zod");
const userValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: "Name must be a string",
            required_error: "Name is required",
        }).min(1, { message: "Name cannot be empty" }),
        email: zod_1.z.string({
            invalid_type_error: "Email must be a string",
            required_error: "Email is required",
        }).email({ message: "Invalid email format" }),
        password: zod_1.z.string({
            invalid_type_error: "Password must be a string",
            required_error: "Password date is required",
        }).min(6, { message: "Password must be at least 6 characters long" }),
    })
});
exports.UserControllerValidation = {
    userValidation
};
