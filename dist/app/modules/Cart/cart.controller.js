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
exports.CartController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const cart_service_1 = require("./cart.service");
const createCart = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_service_1.CartServices.createCartIntoDB(req === null || req === void 0 ? void 0 : req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Cart added successfully!",
        data: result
    });
}));
const getSingleCart = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { cartId } = req.params;
    const result = yield cart_service_1.CartServices.getSingleCartFromDB(cartId, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Cart fetched successfully!",
        data: result
    });
}));
const updateCart = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    const userId = req.user.id;
    const result = yield cart_service_1.CartServices.updateCartIntoDB(cartId, userId, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Cart updated successfully!",
        data: result
    });
}));
const deleteCart = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    const userId = req.user.id;
    const result = yield cart_service_1.CartServices.deleteCartFromDB(cartId, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Cart deleted successfully!",
        data: result
    });
}));
exports.CartController = {
    createCart,
    getSingleCart,
    updateCart,
    deleteCart
};
