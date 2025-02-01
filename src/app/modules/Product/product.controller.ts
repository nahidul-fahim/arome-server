import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { ProductServices } from "./product.service";

// Create a new product
const createNewProduct = catchAsync(async (req, res) => {
  const cloudinaryResult = req.cloudinaryResult;
  const vendorId = req!.user!.id;
  const result = await ProductServices.createProductIntoDb(vendorId, cloudinaryResult, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

// Get all products
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDb();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All products fetched successfully",
    data: result,
  });
});

// Get a single product by id
const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProductFromDb(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product fetched successfully",
    data: result,
  });
});

// Get all products of a vendor
const getVendorAllProducts = catchAsync(async (req, res) => {
  const { vendorId } = req.query;
  if (!vendorId || typeof vendorId !== 'string') {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Vendor ID is required and must be a string",
      data: null,
    });
  }
  const result = await ProductServices.getVendorAllProductsFromDb(vendorId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All products for the vendor fetched successfully",
    data: result,
  });
});


// Update a product by id
const updateProduct = catchAsync(async (req, res) => {
  const cloudinaryResult = req.cloudinaryResult;
  const { id } = req.params;
  const vendorId = req!.user!.id;
  const result = await ProductServices.updateProductIntoDb(vendorId, cloudinaryResult, id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// Delete a product by id
const deleteProduct = catchAsync(async (req, res) => {
  const { id: productId } = req.params;
  const userId = req!.user!.id;
  await ProductServices.deleteProductFromDb(productId, userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

export const ProductController = {
  createNewProduct,
  getAllProducts,
  getSingleProduct,
  getVendorAllProducts,
  updateProduct,
  deleteProduct,
};
