import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { UserRole, UserStatus } from "@prisma/client";
import { excludeSensitiveFields } from "../../../utils/sanitize";
import { ICustomer } from "./customer.interface";
import { validateUser } from "../../../utils/validate-user";
import { validateAuthorized } from "../../../utils/validate-authorized";

// get all customers
const getAllCustomersFromDb = async () => {
  const allCustomers = await prisma.user.findMany({
    where: {
      role: UserRole.CUSTOMER,
      isDeleted: false
    },
    include: {
      customer: true
    },
  });
  return allCustomers.map((customer) => {
    return excludeSensitiveFields(customer, ["password"]);
  });
}

// get single customer
const getSingleCustomerFromDb = async (customerId: string, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  await validateAuthorized(customerId, currentUser.role, currentUser.id);
  const result = await prisma.user.findUnique({
    where: {
      id: customerId,
      role: UserRole.CUSTOMER,
      isDeleted: false
    },
    include: {
      customer: true
    }
  });
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  return excludeSensitiveFields(result, ["password"]);
}

// update customer
const updateCustomerIntoDb = async (cloudinaryResult: any, id: string, updatedData: Partial<ICustomer>, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  await validateAuthorized(id, currentUser.role, currentUser.id);
  const user = await prisma.user.findUnique({
    where: {
      id,
      role: UserRole.CUSTOMER,
      isDeleted: false
    },
    include: {
      customer: true
    }
  });
  if (!user || !user.customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!")
  }
  const customerUpdateData: Partial<ICustomer> = { ...updatedData };
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    customerUpdateData.profilePhoto = cloudinaryResult.secure_url;
  };
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id
      },
      data: {
        name: customerUpdateData?.name,
      }
    });
    const updatedCustomer = await tx.customer.update({
      where: {
        userId: id,
        isDeleted: false
      },
      data: {
        ...customerUpdateData,
      }
    });
    return { ...updatedUser, customer: updatedCustomer };
  })
  return excludeSensitiveFields(result, ["password"]);
};

// delete customer
const deleteCustomerFromDb = async (id: string, userId: string) => {
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  await validateAuthorized(id, currentUser.role, currentUser.id);
  const user = await prisma.user.findUnique({
    where: {
      id,
      role: UserRole.CUSTOMER,
      isDeleted: false
    },
    include: {
      customer: true
    }
  });
  if (!user || !user.customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!")
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedUser = await tx.user.update({
      where: {
        id
      },
      data: {
        isDeleted: true
      }
    });
    await tx.customer.update({
      where: {
        userId: id,
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


export const CustomerServices = {
  getAllCustomersFromDb,
  getSingleCustomerFromDb,
  updateCustomerIntoDb,
  deleteCustomerFromDb
}