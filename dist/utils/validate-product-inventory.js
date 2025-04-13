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
exports.validateProductInventory = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_error_1 = __importDefault(require("../errors/api-error"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const validateProductInventory = (productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUnique({
        where: {
            id: productId,
        }
    });
    if (!product)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found!");
    if (product.inventory < quantity)
        throw new api_error_1.default(400, `Insufficient inventory for product ${product.name}`);
    return product;
});
exports.validateProductInventory = validateProductInventory;
