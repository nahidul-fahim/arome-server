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
exports.ProductServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
// create new product
const createProductIntoDb = (vendorId, cloudinaryResult, data) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.user.findUnique({
        where: {
            id: vendorId,
            role: client_1.UserRole.VENDOR,
            isDeleted: false
        },
        include: {
            vendor: true
        }
    });
    if (!vendor || !vendor.vendor)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    const isShopExist = yield prisma_1.default.shop.findUnique({
        where: {
            id: data.shopId,
            isDeleted: false
        }
    });
    if (!isShopExist)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Shop not found!");
    const category = yield prisma_1.default.category.findUnique({
        where: {
            id: data.categoryId,
        }
    });
    if (!category)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found!");
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        data.image = cloudinaryResult.secure_url;
    }
    if (vendorId) {
        data.vendorId = vendorId;
    }
    const result = yield prisma_1.default.product.create({
        data
    });
    return result;
});
// get all products
const getAllProductsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findMany({
        where: {
            isDeleted: false
        },
        include: {
            category: true,
            shop: true,
        }
    });
    return result;
});
// get single product
const getSingleProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
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
});
// get shop all products
const getShopAllProductsFromDb = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUnique({
        where: {
            id: shopId,
            isDeleted: false
        },
        include: {
            vendor: true
        }
    });
    if (!shop)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Shop not found!");
    const result = yield prisma_1.default.product.findMany({
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
});
// update product
const updateProductIntoDb = (vendorId, cloudinaryResult, productId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const currentVendor = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: vendorId,
            role: client_1.UserRole.VENDOR,
            isDeleted: false
        }
    });
    const currentProduct = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
            isDeleted: false
        },
        select: {
            vendorId: true
        }
    });
    if (!currentProduct)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found!");
    if (currentProduct.vendorId !== currentVendor.id)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    if (data.categoryId) {
        yield prisma_1.default.category.findUniqueOrThrow({
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
    const result = yield prisma_1.default.product.update({
        where: {
            id: productId,
            isDeleted: false
        },
        data,
        include: {
            category: true,
            shop: true,
        }
    });
    return result;
});
// delete product
const deleteProductFromDb = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            isDeleted: false
        }
    });
    if (!currentUser)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    const currentProduct = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false
        },
        select: {
            vendorId: true
        }
    });
    if (!currentProduct)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found!");
    const isAdmin = currentUser.role === client_1.UserRole.ADMIN || currentUser.role === client_1.UserRole.SUPER_ADMIN;
    const isAuthorized = (currentProduct === null || currentProduct === void 0 ? void 0 : currentProduct.vendorId) === userId || isAdmin;
    if (!isAuthorized)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const result = yield prisma_1.default.product.update({
        where: {
            id: productId,
            isDeleted: false
        },
        data: {
            isDeleted: true
        }
    });
    return result;
});
exports.ProductServices = {
    createProductIntoDb,
    getAllProductsFromDb,
    getSingleProductFromDb,
    getShopAllProductsFromDb,
    updateProductIntoDb,
    deleteProductFromDb
};
