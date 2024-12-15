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
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const user_service_1 = require("./user.service");
// create new admin
const createNewAdmin = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createNewAdminIntoDb(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Admin created successfully!",
        data: {
            accessToken: result.accessToken,
            result: result.newAdmin
        }
    });
}));
// create new customer
const createNewCustomer = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createNewCustomerIntoDb(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Customer created successfully!",
        data: {
            accessToken: result.accessToken,
            result: result.newCustomer
        }
    });
}));
// create new vendor
const createNewVendor = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createNewVendorIntoDb(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Vendor created successfully!",
        data: {
            accessToken: result.accessToken,
            result: result.newVendor
        }
    });
}));
exports.UserController = {
    createNewAdmin,
    createNewCustomer,
    createNewVendor
};
