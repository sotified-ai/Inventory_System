import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { comparePassword } from '../../utils/password';
import { HttpError } from '../../core/HttpError';

export class AuthService {
    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user || user.status !== 'active') {
            throw new HttpError(401, 'Invalid credentials or inactive account');
        }

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) {
            throw new HttpError(401, 'Invalid credentials');
        }

        const accessToken = this.generateAccessToken(user.id, user.role.name);
        const refreshToken = this.generateRefreshToken(user.id);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        return { accessToken, refreshToken, user: { id: user.id, name: user.name, role: user.role.name } };
    }

    async refresh(token: string) {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: { include: { role: true } } },
        });

        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw new HttpError(401, 'Invalid refresh token');
        }

        const accessToken = this.generateAccessToken(storedToken.user.id, storedToken.user.role.name);
        const newRefreshToken = this.generateRefreshToken(storedToken.user.id);

        // Revoke old, create new
        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });

        await prisma.refreshToken.create({
            data: {
                userId: storedToken.user.id,
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken, refreshToken: newRefreshToken };
    }

    private generateAccessToken(userId: number, role: string) {
        return jwt.sign({ id: userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    }

    private generateRefreshToken(userId: number) {
        return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    }
}
