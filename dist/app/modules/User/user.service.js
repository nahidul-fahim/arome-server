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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const jwt_helpers_1 = require("../../../helpers/jwt-helpers");
const config_1 = __importDefault(require("../../../config"));
// create admin
const createNewAdminIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    const newAdmin = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
            }
        });
        const admin = yield tx.admin.create({
            data: {
                name: data.name,
                email: data.email,
            }
        });
        return admin;
    }));
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: newAdmin.id,
        email: newAdmin.email,
        role: client_1.UserRole.ADMIN,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    const refreshToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: newAdmin.id,
        email: newAdmin.email,
        role: client_1.UserRole.ADMIN,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        newAdmin
    };
});
// create new customer
const createNewCustomerIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    const newCustomer = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: client_1.UserRole.CUSTOMER,
            }
        });
        const customer = yield tx.customer.create({
            data: {
                name: data.name,
                email: data.email,
            }
        });
        return customer;
    }));
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: newCustomer.id,
        email: newCustomer.email,
        role: client_1.UserRole.CUSTOMER,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    const refreshToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: newCustomer.id,
        email: newCustomer.email,
        role: client_1.UserRole.CUSTOMER,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        newCustomer
    };
});
// create new vendor
const createNewVendorIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    const newVendor = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: client_1.UserRole.VENDOR,
            }
        });
        const vendor = yield tx.vendor.create({
            data: {
                shopName: data.shopName,
                email: data.email,
                logo: data.logo,
                description: data.description,
            }
        });
        return vendor;
    }));
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: newVendor.id,
        email: newVendor.email,
        role: client_1.UserRole.VENDOR,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    const refreshToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: newVendor.id,
        email: newVendor.email,
        role: client_1.UserRole.VENDOR,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        newVendor
    };
});
exports.UserService = {
    createNewAdminIntoDb,
    createNewCustomerIntoDb,
    createNewVendorIntoDb
};
