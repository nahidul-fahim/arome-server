"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validate_request_1 = __importDefault(require("../../../middlewares/validate-request"));
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post("/login", (0, validate_request_1.default)(auth_validation_1.AuthValidation.loginValidation), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
exports.AuthRoutes = router;
