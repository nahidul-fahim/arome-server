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
exports.VendorServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const sanitize_1 = require("../../../utils/sanitize");
// get all vendors
const getAllVendorsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const allVendors = yield prisma_1.default.vendor.findMany({
        where: {
            isDeleted: false
        }
    });
    return allVendors;
});
// get single vendor
const getSingleVendorFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return vendor;
});
// update vendor
const updateVendorIntoDb = (cloudinaryResult, id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const currentVendor = yield prisma_1.default.vendor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!currentVendor) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Vendor not found!");
    }
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        updatedData.logo = cloudinaryResult.secure_url;
    }
    const result = yield prisma_1.default.vendor.update({
        where: {
            id,
            isDeleted: false
        },
        data: updatedData
    });
    return result;
});
// delete vendor
const deleteVendorFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield prisma_1.default.vendor.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!vendor) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Vendor not found!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedVendor = yield tx.vendor.update({
            where: {
                id,
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });
        const deletedUser = yield tx.user.update({
            where: {
                email: deletedVendor.email
            },
            data: {
                status: client_1.UserStatus.SUSPENDED
            }
        });
        const deletedInfo = (0, sanitize_1.excludeSensitiveFields)(deletedUser, ["status", "password"]);
        return deletedInfo;
    }));
    return result;
});
exports.VendorServices = {
    getAllVendorsFromDb,
    getSingleVendorFromDb,
    updateVendorIntoDb,
    deleteVendorFromDb
};
