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
exports.CustomerController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const customer_service_1 = require("./customer.service");
// get all customers
const getAllCustomers = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_service_1.CustomerServices.getAllCustomersFromDb();
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Customers fetched successfully!",
        data: result
    });
}));
// get single customer
const singleCustomer = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_service_1.CustomerServices.getSingleCustomerFromDb(req.params.id, req.user.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Customer fetched successfully!",
        data: result
    });
}));
// update customer
const updateCustomer = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cloudinaryResult = req.cloudinaryResult;
    const result = yield customer_service_1.CustomerServices.updateCustomerIntoDb(cloudinaryResult, req.params.id, req.body, req.user.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Customer updated successfully!",
        data: result
    });
}));
// delete customer
const deleteCustomer = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_service_1.CustomerServices.deleteCustomerFromDb(req.params.id, req.user.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Customer deleted successfully!",
        data: result
    });
}));
exports.CustomerController = {
    getAllCustomers,
    singleCustomer,
    updateCustomer,
    deleteCustomer
};
