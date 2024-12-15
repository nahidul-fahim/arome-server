import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { CategoryServices } from "./category.service";

// Create a new category
const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategoryIntoDb(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Category created successfully!",
    data: result
  });
});

// Get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDb();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Categories fetched successfully!",
    data: result
  });
});

// Get a single category by ID
const getSingleCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getSingleCategoryFromDb(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category fetched successfully!",
    data: result
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory
};
