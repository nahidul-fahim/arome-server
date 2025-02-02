import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { OrderServices } from "./order.service";

// get all customers
const createNewOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.createOrderIntoDb(req?.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Order created successfully!",
    data: result
  })
});

// get all orders from db
const getAllOrders = catchAsync(async (req, res) => {
  const adminId = req!.user!.id;
  const result = await OrderServices.getAllOrdersFromDb(adminId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders fetched successfully!",
    data: result
  })
})

// get all vendor orders
const getVendorAllOrders = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  const userId = req!.user!.id;
  const result = await OrderServices.getVendorAllOrdersFromDb(vendorId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders fetched successfully!",
    data: result
  })
})

export const OrderController = {
  createNewOrder,
  getAllOrders,
  getVendorAllOrders
}