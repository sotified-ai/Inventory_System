"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const password_1 = require("../../utils/password");
const HttpError_1 = require("../../core/HttpError");
class AuthService {
    async login(email, password) {
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user || user.status !== 'active') {
            throw new HttpError_1.HttpError(401, 'Invalid credentials or inactive account');
        }
        const valid = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!valid) {
            throw new HttpError_1.HttpError(401, 'Invalid credentials');
        }
        const accessToken = this.generateAccessToken(user.id, user.role.name);
        const refreshToken = this.generateRefreshToken(user.id);
        await db_1.prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        return { accessToken, refreshToken, user: { id: user.id, name: user.name, role: user.role.name } };
    }
    async refresh(token) {
        const storedToken = await db_1.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: { include: { role: true } } },
        });
        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw new HttpError_1.HttpError(401, 'Invalid refresh token');
        }
        const accessToken = this.generateAccessToken(storedToken.user.id, storedToken.user.role.name);
        const newRefreshToken = this.generateRefreshToken(storedToken.user.id);
        // Revoke old, create new
        await db_1.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });
        await db_1.prisma.refreshToken.create({
            data: {
                userId: storedToken.user.id,
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return { accessToken, refreshToken: newRefreshToken };
    }
    generateAccessToken(userId, role) {
        return jsonwebtoken_1.default.sign({ id: userId, role }, env_1.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    }
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, env_1.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
