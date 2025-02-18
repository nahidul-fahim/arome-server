import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";
import { CustomerController } from "./customer.controller";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CustomerController.getAllCustomers
)

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  CustomerController.singleCustomer
)

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
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
  CustomerController.updateCustomer
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.CUSTOMER),
  CustomerController.deleteCustomer
)


export const customerRoutes = router;