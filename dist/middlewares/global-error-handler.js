"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    let stack = err.stack;
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        message = 'Validation Error';
        error = err.message;
        stack = config_1.default.env === 'development' ? err.stack : null;
    }
    if (err instanceof zod_1.ZodError) {
        statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        message = err.errors[0].message;
        error = err.errors;
        stack = config_1.default.env === 'development' ? err.stack : null;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = "Duplicate Key error";
            error = err.meta;
            stack = config_1.default.env === 'development' ? err.stack : null;
        }
        else if (err.code === 'P2025') {
            message = "No data found";
            statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
            error = err.meta;
            stack = config_1.default.env === 'development' ? err.stack : null;
        }
    }
    res.status(statusCode).json({
        success,
        message,
        error,
        stack
    });
};
exports.default = globalErrorHandler;
