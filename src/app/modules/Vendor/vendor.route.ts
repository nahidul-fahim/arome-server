import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { VendorController } from "./vendor.controller";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  VendorController.getAllVendors
)

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  VendorController.singleVendor
)

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  upload.single('file'),
  sendImageToCloudinary,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, "Invalid JSON data in req.body.data"));
    }
  },
  VendorController.updateVendor
)

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR),
  VendorController.deleteVendor
)


export const vendorRoutes = router;