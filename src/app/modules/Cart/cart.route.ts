import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../../middlewares/validate-request";
import { CartController } from "./cart.controller";
import { CartValidation } from "./cart.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.CUSTOMER),
    validateRequest(CartValidation.createCartValidation),
    CartController.createCart
)

router.get(
    "/:cartId",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    CartController.getSingleCart
)

router.patch(
    "/:cartId",
    auth(UserRole.CUSTOMER),
    validateRequest(CartValidation.updateCartValidation),
    CartController.updateCart
)

router.delete(
    "/:cartId",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    CartController.deleteCart
)

export const cartRoutes = router;