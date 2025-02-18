import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { VendorServices } from "./vendor.service";

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
  const result = await VendorServices.getSingleVendorFromDb(req.params.id, req!.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor fetched successfully!",
    data: result
  })
});

// update vendor
const updateVendor = catchAsync(async (req, res) => {
  const cloudinaryResult = req.cloudinaryResult;
  const result = await VendorServices.updateVendorIntoDb(cloudinaryResult, req.params.id, req.body, req!.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor updated successfully!",
    data: result
  })
});

// delete vendor
const deleteVendor = catchAsync(async (req, res) => {
  const result = await VendorServices.deleteVendorFromDb(req.params.id, req!.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor deleted successfully!",
    data: result
  })
});

export const VendorController = {
  getAllVendors,
  singleVendor,
  updateVendor,
  deleteVendor
}