"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validate_request_1 = __importDefault(require("../../../middlewares/validate-request"));
const cart_controller_1 = require("./cart.controller");
const cart_validation_1 = require("./cart.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validate_request_1.default)(cart_validation_1.CartValidation.createCartValidation), cart_controller_1.CartController.createCart);
router.get("/:cartId", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), cart_controller_1.CartController.getSingleCart);
router.patch("/:cartId", (0, auth_1.default)(client_1.UserRole.CUSTOMER), (0, validate_request_1.default)(cart_validation_1.CartValidation.updateCartValidation), cart_controller_1.CartController.updateCart);
router.delete("/:cartId", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), cart_controller_1.CartController.deleteCart);
exports.cartRoutes = router;
