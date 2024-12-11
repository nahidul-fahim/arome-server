import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { IVendor } from "./vendor.interface";


// get all vendors
const getAllVendorsFromDb = async () => {
  const allVendors = await prisma.vendor.findMany({
    where: {
      isDeleted: false
    }
  });
  return allVendors;
}

// get single vendor
const getSingleVendorFromDb = async (id: string, tokenEmail: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });

  if (vendor.email !== tokenEmail) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized")
  }
  return vendor;
}

// update vendor
const updateVendorIntoDb = async (id: string, data: Partial<IVendor>) => {
  
}


export const VendorServices = {
  getAllVendorsFromDb,
  getSingleVendorFromDb,
  updateVendorIntoDb
}