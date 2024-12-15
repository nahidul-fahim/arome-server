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
exports.VendorController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const vendor_service_1 = require("./vendor.service");
// get all vendors
const getAllVendors = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.getAllVendorsFromDb();
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Vendors fetched successfully!",
        data: result
    });
}));
// get single vendor
const singleVendor = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.getSingleVendorFromDb(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Vendor fetched successfully!",
        data: result
    });
}));
// update vendor
const updateVendor = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cloudinaryResult = req.cloudinaryResult;
    const result = yield vendor_service_1.VendorServices.updateVendorIntoDb(cloudinaryResult, req.params.id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Vendor updated successfully!",
        data: result
    });
}));
// delete vendor
const deleteVendor = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendor_service_1.VendorServices.deleteVendorFromDb(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Vendor deleted successfully!",
        data: result
    });
}));
exports.VendorController = {
    getAllVendors,
    singleVendor,
    updateVendor,
    deleteVendor
};
