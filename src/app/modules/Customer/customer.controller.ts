import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { CustomerServices } from "./customer.service";

// get all customers
const getAllCustomers = catchAsync(async (req, res) => {
  const result = await CustomerServices.getAllCustomersFromDb();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customers fetched successfully!",
    data: result
  })
});

// get single customer
const singleCustomer = catchAsync(async (req, res) => {
  const result = await CustomerServices.getSingleCustomerFromDb(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer fetched successfully!",
    data: result
  })
});

// update customer
const updateCustomer = catchAsync(async (req, res) => {
  const cloudinaryResult = req.cloudinaryResult;
  const result = await CustomerServices.updateCustomerIntoDb(cloudinaryResult, req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer updated successfully!",
    data: result
  })
});

// delete customer
const deleteCustomer = catchAsync(async (req, res) => {
  const result = await CustomerServices.deleteCustomerFromDb(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer deleted successfully!",
    data: result
  })
});

export const CustomerController = {
  getAllCustomers,
  singleCustomer,
  updateCustomer,
  deleteCustomer
}