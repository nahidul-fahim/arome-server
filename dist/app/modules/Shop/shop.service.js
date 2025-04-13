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
exports.ShopServices = void 0;
const client_1 = require("@prisma/client");
const validate_user_1 = require("../../../utils/validate-user");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const createNewShopIntoDb = (data, cloudinaryResult) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield (0, validate_user_1.validateUser)(data.vendorId, client_1.UserStatus.ACTIVE, [client_1.UserRole.VENDOR]);
    const hasExistingShop = yield prisma_1.default.shop.findFirst({
        where: {
            vendorId: vendor.id
        }
    });
    if (hasExistingShop)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You already have a shop!");
    const shopData = Object.assign({}, data);
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        shopData.logo = cloudinaryResult.secure_url;
    }
    ;
    const result = yield prisma_1.default.shop.create({
        data: shopData
    });
    return result;
});
const getVendorShopFromDb = (vendorId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield (0, validate_user_1.validateUser)(vendorId, client_1.UserStatus.ACTIVE, [client_1.UserRole.VENDOR]);
    const shop = yield prisma_1.default.shop.findFirst({
        where: {
            vendorId: vendor.id
        },
        include: {
            vendor: true,
        }
    });
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.VENDOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const isAdmin = currentUser.role === client_1.UserRole.ADMIN || currentUser.role === client_1.UserRole.SUPER_ADMIN;
    const isAuthorized = (shop === null || shop === void 0 ? void 0 : shop.vendorId) === userId || isAdmin;
    if (!isAuthorized)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    return shop;
});
const updateShopIntoDb = (id, data, cloudinaryResult) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.ShopServices = {
    createNewShopIntoDb,
    getVendorShopFromDb
};
