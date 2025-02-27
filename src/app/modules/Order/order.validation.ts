import { z } from "zod";

const createShippingDetailsValidation = z.object({
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  phone: z.string({
    required_error: "Phone number is required",
    invalid_type_error: "Phone number must be a string",
  }),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email({
    message: "Invalid email address",
  }),
  cityId: z.string({
    required_error: "City ID is required",
    invalid_type_error: "City ID must be a string",
  })
});

const updateShippingDetailsValidation = z.object({
  body: z.object({
    address: z.string({
      invalid_type_error: "Address must be a string",
    }).optional(),
    phone: z.string({
      invalid_type_error: "Phone number must be a string",
    }).optional(),
    email: z.string({
      invalid_type_error: "Email must be a string",
    }).email({
      message: "Invalid email address",
    }).optional(),
    cityId: z.string({
      invalid_type_error: "City ID must be a string",
    }).optional()
  })
});

const createOrderValidation = z.object({
  body: z.object({
    customerId: z.string({
      required_error: "Customer ID is required",
      invalid_type_error: "Customer ID must be a string",
    }),
    couponId: z.string({
      invalid_type_error: "Coupon ID must be a string",
    }).optional(),
    shippingDetails: createShippingDetailsValidation,
  }),
});

export const OrderValidation = {
  createOrderValidation,
  updateShippingDetailsValidation,
};