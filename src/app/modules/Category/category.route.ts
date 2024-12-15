import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryController } from "./category.controller";
import validateRequest from "../../../middlewares/validate-request";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(CategoryValidation.createValidation),
  CategoryController.createCategory
)

router.get(
  "/:id",
  CategoryController.getSingleCategory
)

router.get(
  "/",
  CategoryController.getAllCategories
)

export const categoryRoutes = router;