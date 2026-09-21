"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const prisma_1 = require("./utils/prisma");
const start = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log('✅ Database terhubung');
        app_1.default.listen(config_1.config.port, () => {
            console.log(`🚀 E-Circuit Hub API berjalan di http://localhost:${config_1.config.port}`);
            console.log(`📖 Swagger docs di http://localhost:${config_1.config.port}/api-docs`);
            console.log(`🏥 Health check di http://localhost:${config_1.config.port}/api/health`);
        });
    }
    catch (error) {
        console.error('❌ Gagal memulai server:', error);
        process.exit(1);
    }
};
const shutdown = async () => {
    console.log('👋 Shutting down...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
start();
//# sourceMappingURL=server.js.map