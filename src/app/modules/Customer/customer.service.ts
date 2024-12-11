import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { UserStatus } from "@prisma/client";
import { excludeSensitiveFields } from "../../../utils/sanitize";
import { ICustomer } from "./customer.interface";


// get all customers
const getAllCustomersFromDb = async () => {
  const allCustomers = await prisma.customer.findMany({
    where: {
      isDeleted: false
    }
  });
  return allCustomers;
}

// get single customer
const getSingleCustomerFromDb = async (id: string) => {
  const customer = await prisma.customer.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });
  return customer;
}

// update customer
const updateCustomerIntoDb = async (cloudinaryResult: any, id: string, updatedData: Partial<ICustomer>) => {
  const currentCustomer = await prisma.customer.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!currentCustomer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found!")
  }
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    updatedData.profilePhoto = cloudinaryResult.secure_url;
  }
  const result = await prisma.customer.update({
    where: {
      id,
      isDeleted: false
    },
    data: updatedData
  })
  return result;
};

// delete customer
const deleteCustomerFromDb = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found!")
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedCustomer = await tx.customer.update({
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
        email: deletedCustomer.email
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


export const CustomerServices = {
  getAllCustomersFromDb,
  getSingleCustomerFromDb,
  updateCustomerIntoDb,
  deleteCustomerFromDb
}