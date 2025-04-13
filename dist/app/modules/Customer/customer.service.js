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
exports.CustomerServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const sanitize_1 = require("../../../utils/sanitize");
const validate_user_1 = require("../../../utils/validate-user");
const validate_authorized_1 = require("../../../utils/validate-authorized");
// get all customers
const getAllCustomersFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const allCustomers = yield prisma_1.default.user.findMany({
        where: {
            role: client_1.UserRole.CUSTOMER,
            isDeleted: false
        },
        include: {
            customer: true
        },
    });
    return allCustomers.map((customer) => {
        return (0, sanitize_1.excludeSensitiveFields)(customer, ["password"]);
    });
});
// get single customer
const getSingleCustomerFromDb = (customerId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    yield (0, validate_authorized_1.validateAuthorized)(customerId, currentUser.role, currentUser.id);
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: customerId,
            role: client_1.UserRole.CUSTOMER,
            isDeleted: false
        },
        include: {
            customer: true
        }
    });
    if (!result)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    return (0, sanitize_1.excludeSensitiveFields)(result, ["password"]);
});
// update customer
const updateCustomerIntoDb = (cloudinaryResult, id, updatedData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    yield (0, validate_authorized_1.validateAuthorized)(id, currentUser.role, currentUser.id);
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
            role: client_1.UserRole.CUSTOMER,
            isDeleted: false
        },
        include: {
            customer: true
        }
    });
    if (!user || !user.customer) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    const customerUpdateData = Object.assign({}, updatedData);
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        customerUpdateData.profilePhoto = cloudinaryResult.secure_url;
    }
    ;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield tx.user.update({
            where: {
                id
            },
            data: {
                name: customerUpdateData === null || customerUpdateData === void 0 ? void 0 : customerUpdateData.name,
            }
        });
        const updatedCustomer = yield tx.customer.update({
            where: {
                userId: id,
                isDeleted: false
            },
            data: Object.assign({}, customerUpdateData)
        });
        return Object.assign(Object.assign({}, updatedUser), { customer: updatedCustomer });
    }));
    return (0, sanitize_1.excludeSensitiveFields)(result, ["password"]);
});
// delete customer
const deleteCustomerFromDb = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    yield (0, validate_authorized_1.validateAuthorized)(id, currentUser.role, currentUser.id);
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
            role: client_1.UserRole.CUSTOMER,
            isDeleted: false
        },
        include: {
            customer: true
        }
    });
    if (!user || !user.customer) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedUser = yield tx.user.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        yield tx.customer.update({
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
exports.CustomerServices = {
    getAllCustomersFromDb,
    getSingleCustomerFromDb,
    updateCustomerIntoDb,
    deleteCustomerFromDb
};
