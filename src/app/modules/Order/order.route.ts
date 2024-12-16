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

export const orderRoutes = router;