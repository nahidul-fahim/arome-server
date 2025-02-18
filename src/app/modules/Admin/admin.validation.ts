import { z } from "zod";

const vendorStatusValidation = z.object({
    body: z.object({
        isBlacklisted: z.boolean({
            required_error: "Is blacklisted is required",
            invalid_type_error: "Shop name must be a boolean",
        })
    }),
});

export const AdminValidation = {
    vendorStatusValidation
};
