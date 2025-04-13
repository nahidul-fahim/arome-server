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
exports.OrderController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catch_async_1 = __importDefault(require("../../../shared/catch-async"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const order_service_1 = require("./order.service");
const dummy_payment_data_1 = require("../../../dummy-data/dummy-payment-data");
const createNewOrder = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentDetails = dummy_payment_data_1.dummyPaymentData;
    const result = yield order_service_1.OrderServices.createOrderIntoDB(req.body, paymentDetails);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Order created successfully!",
        data: result
    });
}));
const getAllOrders = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.user.id;
    const result = yield order_service_1.OrderServices.getAllOrdersFromDb(adminId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Orders fetched successfully!",
        data: result
    });
}));
const getVendorAllOrders = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vendorId } = req.params;
    const userId = req.user.id;
    const result = yield order_service_1.OrderServices.getVendorAllOrdersFromDb(vendorId, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Vendor orders fetched successfully!",
        data: result
    });
}));
const getCustomerAllPurchases = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const userId = req.user.id;
    const result = yield order_service_1.OrderServices.getCustomerAllPurchasesFromDb(customerId, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Customer purchases fetched successfully!",
        data: result
    });
}));
const getSingleOrder = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userId = req.user.id;
    const result = yield order_service_1.OrderServices.getSingleOrderFromDb(orderId, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order fetched successfully!",
        data: result
    });
}));
const updateShippingDetails = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = req.body;
    const { orderId } = req.params;
    const userId = req.user.id;
    const result = yield order_service_1.OrderServices.updateOrderShippingDetailsIntoDb(orderId, userId, updatedData);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order updated successfully!",
        data: result
    });
}));
const deleteOrder = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userId = req.user.id;
    const result = yield order_service_1.OrderServices.deleteOrderFromDb(orderId, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Order deleted successfully!",
        data: result
    });
}));
exports.OrderController = {
    createNewOrder,
    getAllOrders,
    getVendorAllOrders,
    getCustomerAllPurchases,
    getSingleOrder,
    updateShippingDetails,
    deleteOrder
};
