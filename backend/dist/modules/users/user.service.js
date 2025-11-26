"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../../config/db");
const password_1 = require("../../utils/password");
const HttpError_1 = require("../../core/HttpError");
class UserService {
    async getAll() {
        const users = await db_1.prisma.user.findMany({
            include: { role: true },
        });
        return users.map(u => {
            const { passwordHash, ...rest } = u;
            return rest;
        });
    }
    async getById(id) {
        const user = await db_1.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
        if (!user)
            throw new HttpError_1.HttpError(404, 'User not found');
        const { passwordHash, ...rest } = user;
        return rest;
    }
    async create(data) {
        const existing = await db_1.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new HttpError_1.HttpError(400, 'Email already exists');
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = data;
        const user = await db_1.prisma.user.create({
            data: {
                ...userData,
                passwordHash: hashedPassword,
            },
            include: { role: true },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, ...rest } = user;
        return rest;
    }
}
exports.UserService = UserService;
