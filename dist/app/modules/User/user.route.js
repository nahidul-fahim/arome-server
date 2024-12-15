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
const router = express_1.default.Router();
router.post("/create-admin", 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
(0, validate_request_1.default)(user_validation_1.UserControllerValidation.customerValidation), user_controller_1.UserController.createNewAdmin);
router.post("/create-customer", (0, validate_request_1.default)(user_validation_1.UserControllerValidation.customerValidation), user_controller_1.UserController.createNewCustomer);
router.post("/create-vendor", (0, validate_request_1.default)(user_validation_1.UserControllerValidation.vendorValidation), user_controller_1.UserController.createNewVendor);
exports.userRoutes = router;
