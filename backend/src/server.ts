import app from './app';
import { config } from './config';
import { prisma } from './utils/prisma';

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database terhubung');

    app.listen(config.port, () => {
      console.log(`🚀 E-Circuit Hub API berjalan di http://localhost:${config.port}`);
      console.log(`📖 Swagger docs di http://localhost:${config.port}/api-docs`);
      console.log(`🏥 Health check di http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error);
    process.exit(1);
  }
};

const shutdown = async () => {
  console.log('👋 Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();