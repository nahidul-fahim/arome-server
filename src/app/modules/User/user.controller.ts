import catchAsync from "../../../shared/catch-async"
import { UserService } from "./user.service";

// create new customer
const createNewCustomer = catchAsync(async (req, res) => {
  const result = await UserService.createNewCustomerIntoDb(req.body);
  res.send(result);
});

// create new vendor
const createNewVendor = catchAsync(async (req, res) => {
  const result = await UserService.createNewVendorIntoDb(req.body);
  res.send(result);
})


export const UserController = {
  createNewCustomer,
  createNewVendor
}