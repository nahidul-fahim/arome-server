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
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// create new product
const createProductIntoDb = (vendorId, cloudinaryResult, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            id: vendorId,
            isDeleted: false
        }
    });
    yield prisma_1.default.category.findUniqueOrThrow({
        where: {
            id: data.categoryId,
        }
    });
    if (vendorId) {
        data.vendorId = vendorId;
    }
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        data.image = cloudinaryResult.secure_url;
    }
    const result = yield prisma_1.default.product.create({
        data
    });
    return result;
});
// get all products
const getAllProductsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findMany({});
    return result;
});
// get single product
const getSingleProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
});
// get vendor all products
const getVendorAllProductsFromDb = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            id: vendorId,
            isDeleted: false
        }
    });
    const result = yield prisma_1.default.product.findMany({
        where: {
            vendorId
        }
    });
    return result;
});
// update product
const updateProductIntoDb = (vendorId, cloudinaryResult, id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            id: vendorId,
            isDeleted: false
        }
    });
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id
        }
    });
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
            id
        },
        data
    });
    return result;
});
// delete product
const deleteProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.delete({
        where: {
            id
        }
    });
    return result;
});
exports.ProductServices = {
    createProductIntoDb,
    getAllProductsFromDb,
    getSingleProductFromDb,
    getVendorAllProductsFromDb,
    updateProductIntoDb,
    deleteProductFromDb
};
