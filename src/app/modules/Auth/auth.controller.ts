import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDb(req.body);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken: result.accessToken,
      result: result.userWithoutSensitiveData
    }
  })
});

export const AuthController = {
  loginUser,
};