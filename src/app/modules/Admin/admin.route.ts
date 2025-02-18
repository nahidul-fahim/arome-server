import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { AdminController } from "./admin.controller";
import validateRequest from "../../../middlewares/validate-request";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

router.get(
  "/all-admins",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllAdmins
)

router.get(
  "/single-admin/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.singleAdmin
)

router.patch(
  "/update-admin/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
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
  AdminController.updateAdmin
);

router.delete(
  "/delete-admin/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdmin
)

router.patch(
  "/vendor-status-update/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(AdminValidation.vendorStatusValidation),
  AdminController.vendorStatusUpdate
)


export const adminRoutes = router;