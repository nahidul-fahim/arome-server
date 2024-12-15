import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProductController } from "./product.controller";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import validateRequest from "../../../middlewares/validate-request";
import { ProductValidation } from "./product.validation";

const router = express.Router();
 
router.post(
  "/",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
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
  validateRequest(ProductValidation.createProductValidation),
  ProductController.createNewProduct
);

router.get(
  "/vendor-products",
  ProductController.getVendorAllProducts
)

router.get(
  "/",
  ProductController.getAllProducts
)

router.get(
  "/:id",
  ProductController.getSingleProduct
)

router.patch(
  "/:id",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
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
  validateRequest(ProductValidation.updateProductValidation),
  ProductController.createNewProduct
)


router.delete(
  "/:id",
  auth(UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ProductController.deleteProduct
)


export const productRoutes = router;