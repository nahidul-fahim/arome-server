import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../../middlewares/validate-request";
import { CartController } from "./cart.controller";
import { CartValidation } from "./cart.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.CUSTOMER),
    validateRequest(CartValidation.createCartValidation),
    CartController.createCart
)

router.get(
    "/:cartId",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    CartController.getSingleCart
)

// router.get(
//   "/vendor-orders/:vendorId",
//   auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   OrderController.getVendorAllOrders
// )

// router.get(
//   "/customer-purchases/:customerId",
//   auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   OrderController.getCustomerAllPurchases
// )

// router.get(
//   "/order-details/:orderId",
//   auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
//   OrderController.getSingleOrder
// )

export const cartRoutes = router;