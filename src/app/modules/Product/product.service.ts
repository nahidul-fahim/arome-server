import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma"
import { IProduct } from "./product.interface";
import { UserRole } from "@prisma/client";

// create new product
const createProductIntoDb = async (vendorId: string, cloudinaryResult: any, data: IProduct) => {
  const vendor = await prisma.user.findUnique({
    where: {
      id: vendorId,
      role: UserRole.VENDOR,
      isDeleted: false
    },
    include: {
      vendor: true
    }
  });
  if (!vendor || !vendor.vendor) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  const isShopExist = await prisma.shop.findUnique({
    where: {
      id: data.shopId,
      isDeleted: false
    }
  });
  if (!isShopExist) throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found!");
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    }
  });
  if (!category) throw new ApiError(StatusCodes.NOT_FOUND, "Category not found!");
  if (cloudinaryResult && cloudinaryResult.secure_url) {
    data.image = cloudinaryResult.secure_url;
  }
  if (vendorId) {
    data.vendorId = vendorId;
  }
  const result = await prisma.product.create({
    data
  });
  return result;
}

// get all products
const getAllProductsFromDb = async () => {
  const result = await prisma.product.findMany({
    where: {
      isDeleted: false
    },
    include: {
      category: true,
      shop: true,
    }
  });
  return result;
}

// get single product
const getSingleProductFromDb = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false
    },
    include: {
      category: true,
      shop: true,
    }
  });
  return result;
};

// get shop all products
const getShopAllProductsFromDb = async (shopId: string) => {
  const shop = await prisma.shop.findUnique({
    where: {
      id: shopId,
      isDeleted: false
    },
    include: {
      vendor: true
    }
  });
  if (!shop) throw new ApiError(StatusCodes.NOT_FOUND, "Shop not found!");
  const result = await prisma.product.findMany({
    where: {
      shopId,
      isDeleted: false
    },
    include: {
      category: true,
      shop: true,
    }
  });
  return result;
}

// update product
const updateProductIntoDb = async (vendorId: string, cloudinaryResult: any, productId: string, data: Partial<IProduct>) => {
  const currentVendor = await prisma.user.findUniqueOrThrow({
    where: {
      id: vendorId,
      role: UserRole.VENDOR,
      isDeleted: false
    }
  });
  const currentProduct = await prisma.product.findUnique({
    where: {
      id: productId,
      isDeleted: false
    },
    select: {
      vendorId: true
    }
  });
  if (!currentProduct) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found!");
  if (currentProduct.vendorId !== currentVendor.id) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  if (data.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: data.categoryId,
      }
    });
  }
  if (vendorId) {
    data.vendorId = vendorId;
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
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
      isDeleted: false
    }
  });
  if (!currentUser) throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  const currentProduct = await prisma.product.findUniqueOrThrow({
    where: {
      id: productId,
      isDeleted: false
    },
    select: {
      vendorId: true
    }
  });
  if (!currentProduct) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found!");
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const isAuthorized = currentProduct?.vendorId === userId || isAdmin;
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
  getShopAllProductsFromDb,
  updateProductIntoDb,
  deleteProductFromDb
}