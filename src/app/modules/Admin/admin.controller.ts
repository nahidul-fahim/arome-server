import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { AdminServices } from "./admin.service";

// get all admins
const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDb();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admins fetched successfully!",
    data: result
  })
});

// get single admin
const singleAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.getSingleAdminFromDb(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin fetched successfully!",
    data: result
  })
});

// update admin
const updateAdmin = catchAsync(async (req, res) => {
  const cloudinaryResult = req.cloudinaryResult;
  const result = await AdminServices.updateAdminIntoDb(cloudinaryResult, req.params.id, req.body, req!.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin updated successfully!",
    data: result
  })
});

// delete admin
const deleteAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.deleteAdminFromDb(req.params.id, req!.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result
  })
});

// blacklist vendor
const vendorStatusUpdate = catchAsync(async (req, res) => {
  const result = await AdminServices.vendorStatusUpdateIntoDb(req.params.id, req.body, req!.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Blacklisted vendor successfully!",
    data: result
  })
});

export const AdminController = {
  getAllAdmins,
  singleAdmin,
  updateAdmin,
  deleteAdmin,
  vendorStatusUpdate
}