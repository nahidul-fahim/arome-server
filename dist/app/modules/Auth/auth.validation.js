"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            invalid_type_error: "Email must be a string",
            required_error: "Email is required",
        }).email({ message: "Invalid email format" }),
        password: zod_1.z.string({
            invalid_type_error: "Password must be a string",
            required_error: "Password date is required",
        }),
    })
});
exports.AuthValidation = {
    loginValidation
};
