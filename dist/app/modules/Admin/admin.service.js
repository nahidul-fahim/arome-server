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
const sanitize_1 = require("../../../utils/sanitize");
const client_1 = require("@prisma/client");
const validate_user_1 = require("../../../utils/validate-user");
const getAllAdminsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const allAdmins = yield prisma_1.default.user.findMany({
        where: {
            role: {
                in: [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN],
            },
            isDeleted: false
        }
    });
    return allAdmins.map((admin) => {
        return (0, sanitize_1.excludeSensitiveFields)(admin, ["password"]);
    });
});
const getSingleAdminFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma_1.default.user.findUnique({
        where: {
            id,
            role: {
                in: [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN],
            },
            isDeleted: false
        }
    });
    if (!admin)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Admin not found!");
    return (0, sanitize_1.excludeSensitiveFields)(admin, ["password"]);
});
const updateAdminIntoDb = (cloudinaryResult, id, updatedData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    if (id !== currentUser.id || currentUser.role !== client_1.UserRole.SUPER_ADMIN)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
            role: {
                in: [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN],
            },
            isDeleted: false
        },
        include: {
            admin: true
        }
    });
    if (!user || !user.admin) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Admin not found!");
    }
    const adminUpdateData = Object.assign({}, updatedData);
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        adminUpdateData.profilePhoto = cloudinaryResult.secure_url;
    }
    ;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield tx.user.update({
            where: {
                id,
                role: {
                    in: [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN],
                },
                isDeleted: false
            },
            data: {
                name: adminUpdateData === null || adminUpdateData === void 0 ? void 0 : adminUpdateData.name,
            }
        });
        const updatedAdmin = yield tx.admin.update({
            where: {
                userId: id,
                isDeleted: false
            },
            data: Object.assign({}, adminUpdateData)
        });
        return Object.assign(Object.assign({}, updatedUser), { admin: updatedAdmin });
    }));
    return (0, sanitize_1.excludeSensitiveFields)(result, ["password"]);
});
const deleteAdminFromDb = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    if (id !== currentUser.id || currentUser.role !== client_1.UserRole.SUPER_ADMIN)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const admin = yield prisma_1.default.user.findUnique({
        where: {
            id,
            role: client_1.UserRole.ADMIN,
            isDeleted: false
        },
        include: {
            admin: true
        }
    });
    if (!admin) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedUser = yield tx.user.update({
            where: {
                id: id,
                role: client_1.UserRole.ADMIN,
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });
        yield tx.admin.update({
            where: {
                userId: id,
                isDeleted: false
            },
            data: {
                isDeleted: true
            }
        });
        const deletedInfo = (0, sanitize_1.excludeSensitiveFields)(deletedUser, ["status", "password"]);
        return deletedInfo;
    }));
    return result;
});
const vendorStatusUpdateIntoDb = (vendorId, updatedData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: vendorId,
            role: client_1.UserRole.VENDOR,
            isDeleted: false
        },
        include: {
            vendor: true
        }
    });
    if (!user || !user.vendor) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Vendor not found!");
    }
    const updatedStatusData = Object.assign({}, updatedData);
    if (updatedData.isBlacklisted) {
        updatedStatusData.status = client_1.UserStatus.SUSPENDED;
    }
    else if (!updatedData.isBlacklisted) {
        updatedStatusData.status = client_1.UserStatus.ACTIVE;
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield tx.user.update({
            where: {
                id: vendorId,
                role: client_1.UserRole.VENDOR,
                isDeleted: false
            },
            data: {
                status: updatedStatusData.status
            }
        });
        yield tx.vendor.update({
            where: {
                userId: vendorId,
                isDeleted: false
            },
            data: {
                isBlacklisted: updatedStatusData.isBlacklisted
            }
        });
        const updatedInfo = (0, sanitize_1.excludeSensitiveFields)(updatedUser, ["password"]);
        return updatedInfo;
    }));
    return result;
});
exports.AdminServices = {
    getAllAdminsFromDb,
    getSingleAdminFromDb,
    updateAdminIntoDb,
    deleteAdminFromDb,
    vendorStatusUpdateIntoDb
};
