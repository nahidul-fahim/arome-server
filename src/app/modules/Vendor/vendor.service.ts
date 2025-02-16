import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { IVendor } from "./vendor.interface";
import { UserStatus } from "@prisma/client";
import { excludeSensitiveFields } from "../../../utils/sanitize";


/* TODO: FIX THE VENDOR LIKE CUSTOMER AND ADMIN. ALSO, HAVE ADDED SHOP TO THE VENDOR. ADD FUNCTIONALITY FOR THAT AS WELL */


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
      userId: id,
      isDeleted: false
    }
  });
  return vendor;
}

// update vendor
const updateVendorIntoDb = async (cloudinaryResult: any, id: string, updatedData: Partial<IVendor>) => {
  const currentVendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      userId: id,
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
      userId: id,
      isDeleted: false
    },
    data: updatedData
  })
  return result;
};

// delete vendor
const deleteVendorFromDb = async (id: string) => {
  const vendor = await prisma.vendor.findUnique({
    where: {
      userId: id,
      isDeleted: false
    }
  });
  if (!vendor) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Vendor not found!")
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedVendor = await tx.vendor.update({
      where: {
        userId: id,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    })
    const deletedUser = await tx.user.update({
      where: {
        id: deletedVendor.userId
      },
      data: {
        status: UserStatus.SUSPENDED
      }
    })
    const deletedInfo = excludeSensitiveFields(deletedUser, ["status", "password"]);
    return deletedInfo;
  })
  return result;
}


export const VendorServices = {
  getAllVendorsFromDb,
  getSingleVendorFromDb,
  updateVendorIntoDb,
  deleteVendorFromDb
}