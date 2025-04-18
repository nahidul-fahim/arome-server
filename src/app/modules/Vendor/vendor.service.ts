import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { IVendor } from "./vendor.interface";
import { UserRole, UserStatus } from "@prisma/client";
import { excludeSensitiveFields } from "../../../utils/sanitize";
import { validateUser } from "../../../utils/validate-user";
import { validateAuthorized } from "../../../utils/validate-authorized";

const getAllVendorsFromDb = async () => {
  const allVendors = await prisma.user.findMany({
    where: {
      role: UserRole.VENDOR,
      isDeleted: false
    },
    include: {
      vendor: true
    }
  });
  return allVendors.map((vendor) => {
    return excludeSensitiveFields(vendor, ["password"]);
  });
}

// get single vendor
const getSingleVendorFromDb = async (vendorId: string, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  await validateAuthorized(vendorId, currentUser.role, currentUser.id);
  const result = await prisma.user.findUnique({
    where: {
      id: vendorId,
      role: UserRole.VENDOR,
      isDeleted: false
    },
    include: {
      vendor: true
    }
  });
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  return excludeSensitiveFields(result, ["password"]);
}

// update vendor
const updateVendorIntoDb = async (cloudinaryResult: any, vendorId: string, updatedData: Partial<IVendor>, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  await validateAuthorized(vendorId, currentUser.role, currentUser.id);
  const user = await prisma.user.findUnique({
    where: {
      id: vendorId,
      role: UserRole.VENDOR,
      isDeleted: false
    },
    include: {
      vendor: true
    }
  });
  if (!user || !user.vendor) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!")
  }
  const vendorUpdateData: Partial<IVendor> = { ...updatedData };
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    vendorUpdateData.profilePhoto = cloudinaryResult.secure_url;
  };
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: vendorId,
        role: UserRole.VENDOR,
        isDeleted: false
      },
      data: {
        name: vendorUpdateData?.name,
      }
    });
    const updatedVendor = await tx.vendor.update({
      where: {
        userId: vendorId,
        isDeleted: false
      },
      data: {
        ...vendorUpdateData,
      }
    });
    return { ...updatedUser, vendor: updatedVendor };
  })
  return excludeSensitiveFields(result, ["password"]);
};

// delete vendor
const deleteVendorFromDb = async (vendorId: string, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  await validateAuthorized(vendorId, currentUser.role, currentUser.id);
  const user = await prisma.user.findUnique({
    where: {
      id: vendorId,
      role: UserRole.VENDOR,
      isDeleted: false
    },
    include: {
      vendor: true
    }
  });
  if (!user || !user.vendor) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!")
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedUser = await tx.user.update({
      where: {
        id: vendorId,
      },
      data: {
        isDeleted: true
      }
    });
    await tx.vendor.update({
      where: {
        userId: vendorId,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    });
    await tx.shop.updateMany({
      where: {
        vendorId: vendorId,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    });
    await tx.product.updateMany({
      where: {
        vendorId: vendorId,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    });
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