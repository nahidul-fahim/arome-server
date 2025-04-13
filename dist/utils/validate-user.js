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
exports.validateUser = void 0;
const prisma_1 = __importDefault(require("../shared/prisma"));
const api_error_1 = __importDefault(require("../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const validateUser = (userId, status, roles) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            status,
            role: { in: roles },
            isDeleted: false
        }
    });
    if (!user)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Invalid user: ${userId}`);
    return user;
});
exports.validateUser = validateUser;
