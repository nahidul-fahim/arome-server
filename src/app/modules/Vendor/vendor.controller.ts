import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { VendorServices } from "./vendor.service";
import { Request, Response } from "express";
import { IUser } from "../../../interfaces/user-interface";

// get all vendors
const getAllVendors = catchAsync(async (req, res) => {
  const result = await VendorServices.getAllVendorsFromDb();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendors fetched successfully!",
    data: result
  })
});

// get single vendor
const singleVendor = catchAsync(async (req, res) => {
  const tokenEmail = req.user?.email;
  const result = await VendorServices.getSingleVendorFromDb(req.params.id, tokenEmail as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor fetched successfully!",
    data: result
  })
})

export const VendorController = {
  getAllVendors,
  singleVendor
}