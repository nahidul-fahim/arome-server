import prisma from "../../../shared/prisma"
import { IProduct } from "./product.interface";

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
const updateProductIntoDb = async (vendorId: string, cloudinaryResult: any, id: string, data: Partial<IProduct>) => {
  await prisma.vendor.findUniqueOrThrow({
    where: {
      userId: vendorId,
      isDeleted: false
    }
  });
  await prisma.product.findUniqueOrThrow({
    where: {
      id
    }
  })
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
      id
    },
    data
  });
  return result;
}

// delete product
const deleteProductFromDb = async (id: string) => {
  const result = await prisma.product.delete({
    where: {
      id
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