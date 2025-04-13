"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const vendorStatusValidation = zod_1.z.object({
    body: zod_1.z.object({
        isBlacklisted: zod_1.z.boolean({
            required_error: "Is blacklisted is required",
            invalid_type_error: "Shop name must be a boolean",
        })
    }),
});
exports.AdminValidation = {
    vendorStatusValidation
};
