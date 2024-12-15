"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const product_controller_1 = require("./product.controller");
const send_image_to_cloudinary_1 = require("../../../utils/send-image-to-cloudinary");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const validate_request_1 = __importDefault(require("../../../middlewares/validate-request"));
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), send_image_to_cloudinary_1.upload.single("file"), send_image_to_cloudinary_1.sendImageToCloudinary, (req, res, next) => {
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
}, (0, validate_request_1.default)(product_validation_1.ProductValidation.createProductValidation), product_controller_1.ProductController.createNewProduct);
router.get("/vendor-products", product_controller_1.ProductController.getVendorAllProducts);
router.get("/", product_controller_1.ProductController.getAllProducts);
router.get("/:id", product_controller_1.ProductController.getSingleProduct);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), send_image_to_cloudinary_1.upload.single("file"), send_image_to_cloudinary_1.sendImageToCloudinary, (req, res, next) => {
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
}, (0, validate_request_1.default)(product_validation_1.ProductValidation.updateProductValidation), product_controller_1.ProductController.createNewProduct);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), product_controller_1.ProductController.deleteProduct);
exports.productRoutes = router;
