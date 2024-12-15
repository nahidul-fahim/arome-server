import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { UserStatus } from "@prisma/client";
import { excludeSensitiveFields } from "../../../utils/sanitize";
import { IAdmin } from "./admin.interface";

// get all admins
const getAllAdminsFromDb = async () => {
  const allAdmins = await prisma.admin.findMany({
    where: {
      isDeleted: false
    }
  });
  return allAdmins;
}

// get single admin
const getSingleAdminFromDb = async (id: string) => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });
  return admin;
}

// update admin
const updateAdminIntoDb = async (cloudinaryResult: any, id: string, updatedData: Partial<IAdmin>) => {
  const currentAdmin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!currentAdmin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found!")
  }
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    updatedData.profilePhoto = cloudinaryResult.secure_url;
  }
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false
    },
    data: updatedData
  })
  return result;
};

// delete admin
const deleteAdminFromDb = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found!")
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.update({
      where: {
        id,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    })
    const deletedUser = await tx.user.update({
      where: {
        email: deletedAdmin.email
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


export const AdminServices = {
  getAllAdminsFromDb,
  getSingleAdminFromDb,
  updateAdminIntoDb,
  deleteAdminFromDb
}