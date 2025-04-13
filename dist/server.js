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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Arome server is running on port ${config_1.default.port}`);
        });
    });
}
// Graceful shutdown handling
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down server...");
    yield prisma.$disconnect(); // Disconnect Prisma Client
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Shutting down server...");
    yield prisma.$disconnect();
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
}));
main();
