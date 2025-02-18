import { z } from "zod";

const createShopValidation = z.object({
    body: z.object({
        name: z.string({
            required_error: "Shop name is required",
            invalid_type_error: "Shop name must be a string",
        }).min(1, { message: "Shop name cannot be empty" }),

        description: z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }).min(1, { message: "Description cannot be empty" }),

        vendorId: z.string({
            required_error: "Vendor ID is required",
            invalid_type_error: "Vendor ID must be a string",
        })
    }),
});

export const ShopValidation = {
    createShopValidation
};
