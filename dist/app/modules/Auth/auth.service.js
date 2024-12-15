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
exports.AuthServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sanitize_1 = require("../../../utils/sanitize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const jwt_helpers_1 = require("../../../helpers/jwt-helpers");
const config_1 = __importDefault(require("../../../config"));
// login user into db
const loginUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new api_error_1.default(401, "Password is incorrect");
    }
    ;
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    const refreshToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    const userWithoutSensitiveData = (0, sanitize_1.excludeSensitiveFields)(userData, ["password"]);
    return {
        accessToken,
        refreshToken,
        userWithoutSensitiveData
    };
});
// refresh token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwt_helpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new api_error_1.default(401, "You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const accessToken = jwt_helpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expires_in);
    return accessToken;
});
exports.AuthServices = {
    loginUserIntoDb,
    refreshToken
};
