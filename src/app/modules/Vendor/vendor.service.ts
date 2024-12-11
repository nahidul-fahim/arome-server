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
const getSingleVendorFromDb = async (id: string) => {
  const vendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });
  return vendor;
}

// update vendor
const updateVendorIntoDb = async (cloudinaryResult: any, id: string, updatedData: Partial<IVendor>) => {
  const currentVendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!currentVendor) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vendor not found!")
  }
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    updatedData.logo = cloudinaryResult.secure_url;
  }
  const result = await prisma.vendor.update({
    where: {
      id,
      isDeleted: false
    },
    data: updatedData
  })
  return result;
}


export const VendorServices = {
  getAllVendorsFromDb,
  getSingleVendorFromDb,
  updateVendorIntoDb
}