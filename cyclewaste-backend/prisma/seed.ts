import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'password123';

async function main() {
  console.log('🌱 Menyiapkan seed data...');

  // 1. Users
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const owner = await prisma.user.create({
    data: {
      nama: 'Budi Owner',
      email: 'owner@cyclewaste.id',
      passwordHash,
      role: 'owner',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      nama: 'Siti Owner',
      email: 'siti@cyclewaste.id',
      passwordHash,
      role: 'owner',
    },
  });

  const teknisi = await prisma.user.create({
    data: {
      nama: 'Tono Teknisi',
      email: 'teknisi@cyclewaste.id',
      passwordHash,
      role: 'teknisi',
      telepon: '+62 812-3456-7890',
    },
  });

  const recycler = await prisma.user.create({
    data: {
      nama: 'Rina Recycler',
      email: 'recycler@cyclewaste.id',
      passwordHash,
      role: 'recycler',
      telepon: '+62 813-9876-5432',
    },
  });

  const admin = await prisma.user.create({
    data: {
      nama: 'Admin CycleWaste',
      email: 'admin@cyclewaste.id',
      passwordHash,
      role: 'admin',
    },
  });

  // 2. Devices
  const device1 = await prisma.device.create({
    data: {
      userId: owner.id,
      kategori: 'smartphone',
      merek: 'Samsung',
      tipe: 'Galaxy A52',
      tahunRilis: 2021,
      estimatedWeightGrams: 189,
      components: {
        create: [
          { namaKomponen: 'screen', kondisi: 'rusak_berat' },
          { namaKomponen: 'battery', kondisi: 'baik' },
          { namaKomponen: 'motherboard', kondisi: 'baik' },
        ],
      },
    },
  });

  const device2 = await prisma.device.create({
    data: {
      userId: owner.id,
      kategori: 'laptop',
      merek: 'Dell',
      tipe: 'Latitude 3420',
      tahunRilis: 2020,
      estimatedWeightGrams: 1200,
      components: {
        create: [
          { namaKomponen: 'motherboard', kondisi: 'rusak_berat' },
          { namaKomponen: 'ram', kondisi: 'baik' },
          { namaKomponen: 'storage', kondisi: 'mati' },
        ],
      },
    },
  });

  const device3 = await prisma.device.create({
    data: {
      userId: owner2.id,
      kategori: 'smartphone',
      merek: 'Apple',
      tipe: 'iPhone 11',
      tahunRilis: 2019,
      estimatedWeightGrams: 194,
      components: {
        create: [
          { namaKomponen: 'screen', kondisi: 'mati' },
          { namaKomponen: 'battery', kondisi: 'rusak_berat' },
          { namaKomponen: 'motherboard', kondisi: 'rusak_berat' },
        ],
      },
    },
  });

  // 3. Drop-off points
  await prisma.dropOffPoint.createMany({
    data: [
      {
        namaLokasi: 'Tono Repair Shop',
        latitude: -6.9147,
        longitude: 109.2418,
        tipe: 'repair_shop',
        alamat: 'Jl. Perintis Kemerdekaan No. 12, Kesambi, Cirebon',
        partnerId: teknisi.id,
      },
      {
        namaLokasi: 'Rina Recycling Center',
        latitude: -6.9882,
        longitude: 109.2418,
        tipe: 'recycling_center',
        alamat: 'Jl. Cideng Indah No. 45, Harjamukti, Cirebon',
        partnerId: recycler.id,
      },
    ],
  });

  console.log('✅ Seed data berhasil dibuat!');
  console.log('────────────────────────────────────────');
  console.log('DEMO CREDENTIALS (password sama semua: ' + DEMO_PASSWORD + ')');
  console.log('────────────────────────────────────────');
  console.log(`  Owner:    ${owner.email}`);
  console.log(`  Owner 2:  ${owner2.email}`);
  console.log(`  Teknisi:  ${teknisi.email}`);
  console.log(`  Recycler: ${recycler.email}`);
  console.log(`  Admin:    ${admin.email}`);
  console.log('────────────────────────────────────────');
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error('❌ Seed gagal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();