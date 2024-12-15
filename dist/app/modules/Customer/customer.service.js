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
// get all customers
const getAllCustomersFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const allCustomers = yield prisma_1.default.customer.findMany({
        where: {
            isDeleted: false
        }
    });
    return allCustomers;
});
// get single customer
const getSingleCustomerFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    return customer;
});
// update customer
const updateCustomerIntoDb = (cloudinaryResult, id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const currentCustomer = yield prisma_1.default.customer.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!currentCustomer) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Customer not found!");
    }
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        updatedData.profilePhoto = cloudinaryResult.secure_url;
    }
    const result = yield prisma_1.default.customer.update({
        where: {
            id,
            isDeleted: false
        },
        data: updatedData
    });
    return result;
});
// delete customer
const deleteCustomerFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield prisma_1.default.customer.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    if (!customer) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Customer not found!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedCustomer = yield tx.customer.update({
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
                email: deletedCustomer.email
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
exports.CustomerServices = {
    getAllCustomersFromDb,
    getSingleCustomerFromDb,
    updateCustomerIntoDb,
    deleteCustomerFromDb
};
