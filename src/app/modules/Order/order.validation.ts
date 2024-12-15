import { z } from "zod";

// Create Order Validation
const createOrderValidation = z.object({
  body: z.object({
    customerId: z.string({
      required_error: "Customer ID is required",
      invalid_type_error: "Customer ID must be a string",
    }),

    vendorId: z.string({
      required_error: "Vendor ID is required",
      invalid_type_error: "Vendor ID must be a string",
    }),

    status: z
      .enum(["PENDING", "COMPLETED", "CANCELLED"], {
        required_error: "Status is required",
        invalid_type_error: "Invalid status value",
      })
      .optional(),

    totalAmount: z
      .number({
        required_error: "Total amount is required",
        invalid_type_error: "Total amount must be a number",
      })
      .positive({ message: "Total amount must be greater than 0" }),

    orderItems: z
      .array(
        z.object({
          productId: z.string({
            required_error: "Product ID is required",
            invalid_type_error: "Product ID must be a string",
          }),
          quantity: z
            .number({
              required_error: "Quantity is required",
              invalid_type_error: "Quantity must be a number",
            })
            .positive({ message: "Quantity must be greater than 0" }),
          price: z
            .number({
              required_error: "Price is required",
              invalid_type_error: "Price must be a number",
            })
            .positive({ message: "Price must be greater than 0" }),
        })
      )
      .min(1, { message: "At least one order item is required" }),
  }),
});

// Update Order Validation
const updateOrderValidation = z.object({
  body: z.object({
    customerId: z.string({
      invalid_type_error: "Customer ID must be a string",
    }).optional(),

    vendorId: z.string({
      invalid_type_error: "Vendor ID must be a string",
    }).optional(),

    status: z
      .enum(["PENDING", "COMPLETED", "CANCELLED"], {
        invalid_type_error: "Invalid status value",
      })
      .optional(),

    totalAmount: z
      .number({
        invalid_type_error: "Total amount must be a number",
      })
      .positive({ message: "Total amount must be greater than 0" })
      .optional(),

    orderItems: z
      .array(
        z.object({
          productId: z.string({
            invalid_type_error: "Product ID must be a string",
          }),
          quantity: z
            .number({
              invalid_type_error: "Quantity must be a number",
            })
            .positive({ message: "Quantity must be greater than 0" }),
          price: z
            .number({
              invalid_type_error: "Price must be a number",
            })
            .positive({ message: "Price must be greater than 0" }),
        })
      )
      .optional(),
  }),
});

// Create OrderItem Validation
const createOrderItemValidation = z.object({
  body: z.object({
    orderId: z.string({
      required_error: "Order ID is required",
      invalid_type_error: "Order ID must be a string",
    }),

    productId: z.string({
      required_error: "Product ID is required",
      invalid_type_error: "Product ID must be a string",
    }),

    quantity: z
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .positive({ message: "Quantity must be greater than 0" }),

    price: z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .positive({ message: "Price must be greater than 0" }),
  }),
});

// Update OrderItem Validation
const updateOrderItemValidation = z.object({
  body: z.object({
    orderId: z.string({
      invalid_type_error: "Order ID must be a string",
    }).optional(),

    productId: z.string({
      invalid_type_error: "Product ID must be a string",
    }).optional(),

    quantity: z
      .number({
        invalid_type_error: "Quantity must be a number",
      })
      .positive({ message: "Quantity must be greater than 0" })
      .optional(),

    price: z
      .number({
        invalid_type_error: "Price must be a number",
      })
      .positive({ message: "Price must be greater than 0" })
      .optional(),
  }),
});

export const OrderValidation = {
  createOrderValidation,
  updateOrderValidation,
};

export const OrderItemValidation = {
  createOrderItemValidation,
  updateOrderItemValidation,
};