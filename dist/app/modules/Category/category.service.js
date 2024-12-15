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
exports.CategoryServices = void 0;
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createCategoryIntoDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCategory = yield prisma_1.default.category.findFirst({
        where: {
            name: {
                equals: data.name,
                mode: 'insensitive'
            }
        }
    });
    if (existingCategory) {
        throw new api_error_1.default(409, "Category already exists");
    }
    const result = yield prisma_1.default.category.create({
        data: {
            name: data.name,
            description: data.description
        }
    });
    return result;
});
const getAllCategoriesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany();
    return result;
});
const getSingleCategoryFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUniqueOrThrow({
        where: {
            id
        }
    });
    return result;
});
exports.CategoryServices = {
    createCategoryIntoDb,
    getAllCategoriesFromDb,
    getSingleCategoryFromDb
};
