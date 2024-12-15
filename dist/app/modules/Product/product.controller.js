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
exports.ProductController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const product_service_1 = require("./product.service");
// Create a new product
const createNewProduct = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cloudinaryResult = req.cloudinaryResult;
    const vendorId = req.user.id;
    const result = yield product_service_1.ProductServices.createProductIntoDb(vendorId, cloudinaryResult, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Product created successfully!",
        data: result,
    });
}));
// Get all products
const getAllProducts = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.getAllProductsFromDb();
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All products fetched successfully",
        data: result,
    });
}));
// Get a single product by id
const getSingleProduct = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.ProductServices.getSingleProductFromDb(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product fetched successfully",
        data: result,
    });
}));
// Get all products of a vendor
const getVendorAllProducts = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.query;
    if (!vendorId || typeof vendorId !== 'string') {
        return (0, send_response_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: "Vendor ID is required and must be a string",
            data: null,
        });
    }
    const result = yield product_service_1.ProductServices.getVendorAllProductsFromDb(vendorId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All products for the vendor fetched successfully",
        data: result,
    });
}));
// Update a product by id
const updateProduct = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cloudinaryResult = req.cloudinaryResult;
    const { id } = req.params;
    const vendorId = req.user.id;
    const result = yield product_service_1.ProductServices.updateProductIntoDb(vendorId, cloudinaryResult, id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
}));
// Delete a product by id
const deleteProduct = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield product_service_1.ProductServices.deleteProductFromDb(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Product deleted successfully",
        data: null,
    });
}));
exports.ProductController = {
    createNewProduct,
    getAllProducts,
    getSingleProduct,
    getVendorAllProducts,
    updateProduct,
    deleteProduct,
};
