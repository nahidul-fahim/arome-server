import { z } from "zod";

// Create Order Validation
const createOrderValidation = z.object({
  body: z.object({
    customerId: z.string({
      required_error: "Customer ID is required",
      invalid_type_error: "Customer ID must be a string",
    })
  }),
});

// Update Order Validation
const updateOrderValidation = z.object({
  body: z.object({
    customerId: z.string({
      invalid_type_error: "Customer ID must be a string",
    }),
  }),
});


export const OrderValidation = {
  createOrderValidation,
  updateOrderValidation,
};