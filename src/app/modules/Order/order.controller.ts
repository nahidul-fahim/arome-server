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

// get vendor all orders
const getVendorAllOrders = catchAsync(async (req, res) => {
  const { vendorId } = req.params;
  const userId = req!.user!.id;
  const result = await OrderServices.getVendorAllOrdersFromDb(vendorId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor orders fetched successfully!",
    data: result
  })
})

// get customer all orders
const getCustomerAllPurchases = catchAsync(async (req, res) => {
  const { customerId } = req.params;
  const userId = req!.user!.id;
  const result = await OrderServices.getCustomerAllPurchasesFromDb(customerId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer purchases fetched successfully!",
    data: result
  })
})

// get single order
const getSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req!.user!.id;
  const result = await OrderServices.getSingleOrderFromDb(orderId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order fetched successfully!",
    data: result
  })
})

export const OrderController = {
  createNewOrder,
  getAllOrders,
  getVendorAllOrders,
  getCustomerAllPurchases,
  getSingleOrder
}