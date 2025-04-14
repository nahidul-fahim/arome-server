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
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const jwt_helpers_1 = require("../../../helpers/jwt-helpers");
const config_1 = __importDefault(require("../../../config"));
const sanitize_1 = require("../../../utils/sanitize");
const password_hashing_1 = require("../../../utils/password-hashing");
// create admin
const createNewAdminIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, password_hashing_1.hashPassword)(data === null || data === void 0 ? void 0 : data.password);
    const newAdmin = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
            }
        });
        yield tx.admin.create({
            data: {
                name: data.name,
                userId: newUser.id
            }
        });
        return newUser;
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
    const result = (0, sanitize_1.excludeSensitiveFields)(newAdmin, ["password"]);
    return {
        accessToken,
        refreshToken,
        result
    };
});
// create new customer
const createNewCustomerIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, password_hashing_1.hashPassword)(data === null || data === void 0 ? void 0 : data.password);
    const newCustomer = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: client_1.UserRole.CUSTOMER,
            }
        });
        yield tx.customer.create({
            data: {
                name: data.name,
                userId: newUser.id
            }
        });
        return newUser;
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
    const result = (0, sanitize_1.excludeSensitiveFields)(newCustomer, ["password"]);
    return {
        accessToken,
        refreshToken,
        result
    };
});
// create new vendor
const createNewVendorIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, password_hashing_1.hashPassword)(data === null || data === void 0 ? void 0 : data.password);
    const newVendor = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield tx.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: client_1.UserRole.VENDOR,
            }
        });
        yield tx.vendor.create({
            data: {
                name: data.name,
                userId: newUser.id
            }
        });
        return newUser;
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
    const result = (0, sanitize_1.excludeSensitiveFields)(newVendor, ["password"]);
    return {
        accessToken,
        refreshToken,
        result
    };
});
exports.UserService = {
    createNewAdminIntoDb,
    createNewCustomerIntoDb,
    createNewVendorIntoDb
};
