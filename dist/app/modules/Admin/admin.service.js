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
exports.AdminServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const sanitize_1 = require("../../../utils/sanitize");
// get all admins
const getAllAdminsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const allAdmins = yield prisma_1.default.admin.findMany({
        where: {
            isDeleted: false
        }
    });
    return allAdmins;
});
// get single admin
const getSingleAdminFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return admin;
});
// update admin
const updateAdminIntoDb = (cloudinaryResult, id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const currentAdmin = yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!currentAdmin) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Admin not found!");
    }
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        updatedData.profilePhoto = cloudinaryResult.secure_url;
    }
    const result = yield prisma_1.default.admin.update({
        where: {
            id,
            isDeleted: false
        },
        data: updatedData
    });
    return result;
});
// delete admin
const deleteAdminFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!admin) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Admin not found!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedAdmin = yield tx.admin.update({
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
                email: deletedAdmin.email
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
exports.AdminServices = {
    getAllAdminsFromDb,
    getSingleAdminFromDb,
    updateAdminIntoDb,
    deleteAdminFromDb
};
