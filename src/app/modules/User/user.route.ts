import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../../middlewares/validate-request";
import { UserControllerValidation } from "./user.validation";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserControllerValidation.customerValidation),
  UserController.createNewAdmin
)

router.post(
  "/create-customer",
  validateRequest(UserControllerValidation.customerValidation),
  UserController.createNewCustomer
)

router.post(
  "/create-vendor",
  validateRequest(UserControllerValidation.vendorValidation),
  UserController.createNewVendor
)

export const userRoutes = router;