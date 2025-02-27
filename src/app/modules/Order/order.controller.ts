import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { OrderServices } from "./order.service";
import { dummyPaymentData } from "../../../dummy-data/dummy-payment-data";

const createNewOrder = catchAsync(async (req, res) => {
  const paymentDetails = dummyPaymentData;
  const result = await OrderServices.createOrderIntoDB(req.body, paymentDetails);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Order created successfully!",
    data: result
  })
});

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
});

const updateShippingDetails = catchAsync(async (req, res) => {
  const updatedData = req.body;
  const { orderId } = req.params;
  const userId = req!.user!.id;
  const result = await OrderServices.updateOrderShippingDetailsIntoDb(orderId, userId, updatedData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order updated successfully!",
    data: result
  })
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const userId = req!.user!.id;
  const result = await OrderServices.deleteOrderFromDb(orderId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order deleted successfully!",
    data: result
  })
})

export const OrderController = {
  createNewOrder,
  getAllOrders,
  getVendorAllOrders,
  getCustomerAllPurchases,
  getSingleOrder,
  updateShippingDetails,
  deleteOrder
}