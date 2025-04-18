"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const send_image_to_cloudinary_1 = require("../../../utils/send-image-to-cloudinary");
const customer_controller_1 = require("./customer.controller");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), customer_controller_1.CustomerController.getAllCustomers);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CUSTOMER), customer_controller_1.CustomerController.singleCustomer);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CUSTOMER), send_image_to_cloudinary_1.upload.single('file'), send_image_to_cloudinary_1.sendImageToCloudinary, (req, res, next) => {
    var _a;
    try {
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    }
    catch (error) {
        next(new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid JSON data in req.body.data"));
    }
}, customer_controller_1.CustomerController.updateCustomer);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CUSTOMER), customer_controller_1.CustomerController.deleteCustomer);
exports.customerRoutes = router;
