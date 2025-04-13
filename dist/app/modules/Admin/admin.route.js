"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const send_image_to_cloudinary_1 = require("../../../utils/send-image-to-cloudinary");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const admin_controller_1 = require("./admin.controller");
const validate_request_1 = __importDefault(require("../../../middlewares/validate-request"));
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.get("/all-admins", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.getAllAdmins);
router.get("/single-admin/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.singleAdmin);
router.patch("/update-admin/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), send_image_to_cloudinary_1.upload.single('file'), send_image_to_cloudinary_1.sendImageToCloudinary, (req, res, next) => {
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
}, admin_controller_1.AdminController.updateAdmin);
router.delete("/delete-admin/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), admin_controller_1.AdminController.deleteAdmin);
router.patch("/vendor-status-update/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validate_request_1.default)(admin_validation_1.AdminValidation.vendorStatusValidation), admin_controller_1.AdminController.vendorStatusUpdate);
exports.adminRoutes = router;
