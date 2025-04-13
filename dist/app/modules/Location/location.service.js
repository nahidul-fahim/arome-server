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
exports.LocationServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllRegionsFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.region.findMany({
        orderBy: {
            name: 'asc'
        }
    });
    return result;
});
const getAllDistrictsFromDb = (regionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!regionId)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Region id is required!");
    const result = yield prisma_1.default.district.findMany({
        where: {
            regionId
        },
        orderBy: {
            name: 'asc'
        }
    });
    return result;
});
const getAllCitiesFromDb = (districtId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!districtId)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "District id is required!");
    const result = yield prisma_1.default.city.findMany({
        where: {
            districtId
        },
        orderBy: {
            name: 'asc'
        },
        include: {
            ShippingDetails: true
        }
    });
    return result;
});
exports.LocationServices = {
    getAllRegionsFromDb,
    getAllDistrictsFromDb,
    getAllCitiesFromDb
};
