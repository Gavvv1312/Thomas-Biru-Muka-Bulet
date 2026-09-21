import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, JwtPayload } from '../utils/jwt';
import { config } from '../config';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/errors';

export interface RegisterData {
  nama: string;
  email: string;
  password: string;
  role?: 'owner'; // hanya owner untuk public registration
}

export interface LoginResult {
  user: {
    id: string;
    nama: string;
    email: string;
    role: string;
    poinHijau: number;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<LoginResult> {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError('Email sudah terdaftar');

    const role = data.role === 'owner' ? 'owner' : 'owner'; // force owner for public registration

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        nama: data.nama,
        email: data.email,
        passwordHash,
        role,
      },
    });

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        poinHijau: user.poinHijau,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError('Email atau password salah');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Email atau password salah');

    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        poinHijau: user.poinHijau,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Refresh token tidak valid atau kadaluarsa');
    }

    const storedToken = await prisma.refreshToken.findFirst({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!storedToken) throw new UnauthorizedError('Refresh token tidak ditemukan');
    if (storedToken.revokedAt) throw new UnauthorizedError('Refresh token sudah dicabut');
    if (storedToken.expiresAt < new Date()) throw new UnauthorizedError('Refresh token kadaluarsa');

    const tokenMatch = await bcrypt.compare(refreshToken, storedToken.tokenHash);
    if (!tokenMatch) throw new UnauthorizedError('Refresh token tidak valid');

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    const newPayload: JwtPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await this.storeRefreshToken(payload.userId, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await prisma.refreshToken.updateMany({
        where: { userId: payload.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // ignore invalid tokens on logout
    }
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nama: true, email: true, role: true, poinHijau: true, createdAt: true },
    });

    if (!user) throw new UnauthorizedError('User tidak ditemukan');
    return user;
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  async createAdminUser(data: { nama: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        nama: data.nama,
        email: data.email,
        passwordHash,
        role: 'admin',
      },
    });
  }

  async createTechnician(data: { nama: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        nama: data.nama,
        email: data.email,
        passwordHash,
        role: 'teknisi',
      },
    });
  }

  async createRecycler(data: { nama: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        nama: data.nama,
        email: data.email,
        passwordHash,
        role: 'recycler',
      },
    });
  }
}

export const authService = new AuthService();