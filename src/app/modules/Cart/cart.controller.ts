import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { CartServices } from "./cart.service";

const createCart = catchAsync(async (req, res) => {
    const result = await CartServices.createCartIntoDB(req?.body);
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

const updateCart = catchAsync(async (req, res) => {
    const { cartId } = req.params;
    const userId = req!.user!.id;
    const result = await CartServices.updateCartIntoDB(cartId, userId, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart updated successfully!",
        data: result
    })
});

const deleteCart = catchAsync(async (req, res) => {
    const { cartId } = req.params;
    const userId = req!.user!.id;
    const result = await CartServices.deleteCartFromDB(cartId, userId);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart deleted successfully!",
        data: result
    })
});


export const CartController = {
    createCart,
    getSingleCart,
    updateCart,
    deleteCart
}