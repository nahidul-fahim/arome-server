import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { OrderServices } from "./order.service";

// get all customers
const createNewOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderIntoDb(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Order created successfully!",
    data: result
  })
});


export const OrderController = {
  createNewOrder
}