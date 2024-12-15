"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const category_service_1 = require("./category.service");
// Create a new category
const createCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.CategoryServices.createCategoryIntoDb(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Category created successfully!",
        data: result
    });
}));
// Get all categories
const getAllCategories = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.CategoryServices.getAllCategoriesFromDb();
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Categories fetched successfully!",
        data: result
    });
}));
// Get a single category by ID
const getSingleCategory = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.CategoryServices.getSingleCategoryFromDb(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Category fetched successfully!",
        data: result
    });
}));
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory
};
