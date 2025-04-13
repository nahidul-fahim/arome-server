"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validate_request_1 = __importDefault(require("../../../middlewares/validate-request"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-admin", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validate_request_1.default)(user_validation_1.UserControllerValidation.userValidation), user_controller_1.UserController.createNewAdmin);
router.post("/create-customer", (0, validate_request_1.default)(user_validation_1.UserControllerValidation.userValidation), user_controller_1.UserController.createNewCustomer);
router.post("/create-vendor", (0, validate_request_1.default)(user_validation_1.UserControllerValidation.userValidation), user_controller_1.UserController.createNewVendor);
exports.userRoutes = router;
