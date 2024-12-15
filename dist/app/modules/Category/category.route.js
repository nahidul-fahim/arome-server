"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const client_1 = require("@prisma/client");
const category_controller_1 = require("./category.controller");
const validate_request_1 = __importDefault(require("../../../middlewares/validate-request"));
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validate_request_1.default)(category_validation_1.CategoryValidation.createValidation), category_controller_1.CategoryController.createCategory);
router.get("/:id", category_controller_1.CategoryController.getSingleCategory);
router.get("/", category_controller_1.CategoryController.getAllCategories);
exports.categoryRoutes = router;
