import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { VendorController } from "./vendor.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  VendorController.getAllVendors
)

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  VendorController.singleVendor
)


export const vendorRoutes = router;