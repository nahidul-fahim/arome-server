import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { ShopServices } from "./shop.service";

const createNewShop = catchAsync(async (req, res) => {
    const cloudinaryResult = req.cloudinaryResult;
    const result = await ShopServices.createNewShopIntoDb(req?.body, cloudinaryResult);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Shop created successfully!",
        data: result
    })
})


export const ShopController = {
    createNewShop
}