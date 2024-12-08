import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../../middlewares/validate-request";
import { UserControllerValidation } from "./user.validation";

const router = express.Router();

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