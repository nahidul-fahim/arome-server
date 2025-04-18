import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../../middlewares/validate-request";
import { OrderValidation } from "./order.validation";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post(
  "/create-order",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidation.createOrderValidation),
  OrderController.createNewOrder
)

router.get(
  "/all-orders",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getAllOrders
)

router.get(
  "/vendor-orders/:vendorId",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getVendorAllOrders
)

router.get(
  "/customer-purchases/:customerId",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getCustomerAllPurchases
)

router.get(
  "/order-details/:orderId",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  OrderController.getSingleOrder
)

router.patch(
  "/update-order/:orderId",
  auth(UserRole.CUSTOMER),
  validateRequest(OrderValidation.updateShippingDetailsValidation),
  OrderController.updateShippingDetails
)

router.delete(
  "/delete-order/:orderId",
  auth(UserRole.SUPER_ADMIN),
  OrderController.deleteOrder
)

export const orderRoutes = router;