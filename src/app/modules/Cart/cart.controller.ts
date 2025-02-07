import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { CartServices } from "./cart.service";

const createCart = catchAsync(async (req, res) => {
    const result = await CartServices.createCartIntoDb(req?.body);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Cart added successfully!",
        data: result
    })
});

const getSingleCart = catchAsync(async (req, res) => {
    const userId = req!.user!.id;
    const { cartId } = req.params;
    const result = await CartServices.getSingleCartFromDB(cartId, userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart fetched successfully!",
        data: result
    })
});


export const CartController = {
    createCart,
    getSingleCart
}