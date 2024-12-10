import catchAsync from "../../../shared/catch-async";
import { AuthServices } from "./auth.service";


const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDb(req.body);
  res.send(result);
});

export const AuthController = {
  loginUser,
};