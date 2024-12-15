import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async"
import sendResponse from "../../../shared/send-response";
import { UserService } from "./user.service";

// create new admin
const createNewAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createNewAdminIntoDb(req.body);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Admin created successfully!",
    data: {
      accessToken: result.accessToken,
      result: result.newAdmin
    }
  })
})

// create new customer
const createNewCustomer = catchAsync(async (req, res) => {
  const result = await UserService.createNewCustomerIntoDb(req.body);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Customer created successfully!",
    data: {
      accessToken: result.accessToken,
      result: result.newCustomer
    }
  })
});

// create new vendor
const createNewVendor = catchAsync(async (req, res) => {
  const result = await UserService.createNewVendorIntoDb(req.body);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Vendor created successfully!",
    data: {
      accessToken: result.accessToken,
      result: result.newVendor
    }
  })
})


export const UserController = {
  createNewAdmin,
  createNewCustomer,
  createNewVendor
}