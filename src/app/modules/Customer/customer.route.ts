import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";
import { CustomerController } from "./customer.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  CustomerController.getAllCustomers
)

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  CustomerController.singleCustomer
)

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  upload.single('file'),
  sendImageToCloudinary,
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  CustomerController.updateCustomer
)

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  CustomerController.deleteCustomer
)


export const customerRoutes = router;