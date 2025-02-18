import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { excludeSensitiveFields } from "../../../utils/sanitize";
import { IAdmin } from "./admin.interface";
import { UserRole, UserStatus } from "@prisma/client";
import { validateUser } from "../../../utils/validate-user";
import { validateAuthorized } from "../../../utils/validate-authorized";

// get all admins
const getAllAdminsFromDb = async () => {
  const allAdmins = await prisma.user.findMany({
    where: {
      role: {
        in: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      },
      isDeleted: false
    }
  });
  return allAdmins.map((admin) => {
    return excludeSensitiveFields(admin, ["password"]);
  })
}

// get single admin
const getSingleAdminFromDb = async (id: string) => {
  const admin = await prisma.user.findUnique({
    where: {
      id,
      role: {
        in: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      },
      isDeleted: false
    }
  });
  if (!admin) throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found!");
  return excludeSensitiveFields(admin, ["password"]);
}

// update admin
const updateAdminIntoDb = async (cloudinaryResult: any, id: string, updatedData: Partial<IAdmin>, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  if (id !== currentUser.id || currentUser.role !== UserRole.SUPER_ADMIN) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  const user = await prisma.user.findUnique({
    where: {
      id,
      role: {
        in: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      },
      isDeleted: false
    },
    include: {
      admin: true
    }
  });
  if (!user || !user.admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found!")
  }
  const adminUpdateData: Partial<IAdmin> = { ...updatedData };
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    adminUpdateData.profilePhoto = cloudinaryResult.secure_url;
  };
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id,
        role: {
          in: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
        },
        isDeleted: false
      },
      data: {
        name: adminUpdateData?.name,
      }
    });
    const updatedAdmin = await tx.admin.update({
      where: {
        userId: id,
        isDeleted: false
      },
      data: {
        ...adminUpdateData,
      }
    });
    return { ...updatedUser, admin: updatedAdmin };
  })
  return excludeSensitiveFields(result, ["password"]);
};

// delete admin
const deleteAdminFromDb = async (id: string, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  if (id !== currentUser.id || currentUser.role !== UserRole.SUPER_ADMIN) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  const admin = await prisma.user.findUnique({
    where: {
      id,
      role: UserRole.ADMIN,
      isDeleted: false
    },
    include: {
      admin: true
    }
  });
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!")
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedUser = await tx.user.update({
      where: {
        id: id,
        role: UserRole.ADMIN,
        isDeleted: false
      },
      data: {
        isDeleted: true
      }
    })
    await tx.admin.update({
      where: {
        userId: id,
        isDeleted: false
      },
      data: {
        isDeleted: true
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