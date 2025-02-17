import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { sendImageToCloudinary, upload } from "../../../utils/send-image-to-cloudinary";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { ShopController } from "./shop.controller";

const router = express.Router();

router.post(
    "/create-shop",
    auth(UserRole.VENDOR),
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
    ShopController.createNewShop
)