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
exports.AdminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const admin_service_1 = require("./admin.service");
// get all admins
const getAllAdmins = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getAllAdminsFromDb();
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admins fetched successfully!",
        data: result
    });
}));
// get single admin
const singleAdmin = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getSingleAdminFromDb(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin fetched successfully!",
        data: result
    });
}));
// update admin
const updateAdmin = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cloudinaryResult = req.cloudinaryResult;
    const result = yield admin_service_1.AdminServices.updateAdminIntoDb(cloudinaryResult, req.params.id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin updated successfully!",
        data: result
    });
}));
// delete admin
const deleteAdmin = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.deleteAdminFromDb(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Admin deleted successfully!",
        data: result
    });
}));
exports.AdminController = {
    getAllAdmins,
    singleAdmin,
    updateAdmin,
    deleteAdmin
};
