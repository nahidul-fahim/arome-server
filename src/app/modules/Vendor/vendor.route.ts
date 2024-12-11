import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { VendorController } from "./vendor.controller";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";

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

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  upload.single('file'),
  sendImageToCloudinary,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  VendorController.updateVendor
)


export const vendorRoutes = router;