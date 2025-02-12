import { Server } from "http";
import app from "./app";
import config from "./config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let server: Server;

async function main() {
    server = app.listen(config.port, () => {
        console.log(`Arome server is running on port ${config.port}`);
    });
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
    console.log("Shutting down server...");
    await prisma.$disconnect(); // Disconnect Prisma Client
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

process.on("SIGTERM", async () => {
    console.log("Shutting down server...");
    await prisma.$disconnect();
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

main();
