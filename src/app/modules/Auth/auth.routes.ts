import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../../middlewares/validate-request";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidation),
  AuthController.loginUser
)

export const AuthRoutes = router;