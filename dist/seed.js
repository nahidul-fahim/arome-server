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
const http_status_codes_1 = require("http-status-codes");
const geolocation_data_1 = require("../src/data/geolocation-data");
const api_error_1 = __importDefault(require("../src/errors/api-error"));
const prisma_1 = __importDefault(require("../src/shared/prisma"));
function seedMain() {
    return __awaiter(this, void 0, void 0, function* () {
        const createdRegions = yield Promise.all(geolocation_data_1.allRegion.map((region) => __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.region.upsert({
                where: { name: region.name },
                update: {},
                create: { name: region.name }
            });
        })));
        const createdDistricts = yield Promise.all(geolocation_data_1.allDistrict.map((district) => __awaiter(this, void 0, void 0, function* () {
            const region = createdRegions.find(r => r.name === district.region_name);
            if (!region)
                throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `Region ${district.region_name} not found!`);
            return yield prisma_1.default.district.upsert({
                where: { name: district.name },
                update: {},
                create: { name: district.name, regionId: region.id },
            });
        })));
        yield Promise.all(geolocation_data_1.allCity.map((city) => __awaiter(this, void 0, void 0, function* () {
            const district = createdDistricts.find(d => d.name === city.district_name);
            if (!district)
                throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `District ${city.district_name} not found!`);
            return yield prisma_1.default.city.upsert({
                where: { name: city.name },
                update: {},
                create: { name: city.name, districtId: district.id },
            });
        })));
    });
}
seedMain()
    .catch(error => {
    console.error("Error during seeding:", error);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}));
