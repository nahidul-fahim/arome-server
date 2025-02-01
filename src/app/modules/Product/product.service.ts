import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { IProduct } from "./product.interface";
import { UserRole } from "@prisma/client";

// create new product
const createProductIntoDb = async (vendorId: string, cloudinaryResult: any, data: IProduct) => {
  await prisma.vendor.findUniqueOrThrow({
    where: {
      userId: vendorId,
      isDeleted: false
    }
  });
  await prisma.category.findUniqueOrThrow({
    where: {
      id: data.categoryId,
    }
  });
  if (vendorId) {
    data.vendorId = vendorId
  }
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    data.image = cloudinaryResult.secure_url;
  }
  const result = await prisma.product.create({
    data
  });
  return result;
}

// get all products
const getAllProductsFromDb = async () => {
  const result = await prisma.product.findMany({});
  return result;
}

// get single product
const getSingleProductFromDb = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id
    }
  });
  return result;
};

// get vendor all products
const getVendorAllProductsFromDb = async (vendorId: string) => {
  await prisma.vendor.findUniqueOrThrow({
    where: {
      userId: vendorId,
      isDeleted: false
    }
  })
  const result = await prisma.product.findMany({
    where: {
      vendorId
    }
  });
  return result;
}

// update product
const updateProductIntoDb = async (vendorId: string, cloudinaryResult: any, productId: string, data: Partial<IProduct>) => {
  const currentVendor = await prisma.vendor.findUniqueOrThrow({
    where: {
      userId: vendorId,
      isDeleted: false
    },
    select: {
      userId: true
    }
  });
  const currentProduct = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    },
    select: {
      vendorId: true
    }
  })
  if (currentProduct?.vendorId !== currentVendor?.userId) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized to update this product!");
  if (data.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: data.categoryId,
      }
    });
  }
  if (vendorId) {
    data.vendorId = vendorId
  }
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    data.image = cloudinaryResult.secure_url;
  }
  const result = await prisma.product.update({
    where: {
      id: productId
    },
    data
  });
  return result;
}

// delete product
const deleteProductFromDb = async (productId: string, userId: string) => {
  const currentUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  })
  const currentProduct = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId
    },
    select: {
      vendorId: true
    }
  })
  const isAdmin = currentUser.role === (UserRole.ADMIN || UserRole.SUPER_ADMIN);
  const isAuthorized = currentProduct?.vendorId === userId || isAdmin
  if (!isAuthorized) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  const result = await prisma.product.delete({
    where: {
      id: productId
    }
  });
  return result;
}

export const ProductServices = {
  createProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  getVendorAllProductsFromDb,
  updateProductIntoDb,
  deleteProductFromDb
}