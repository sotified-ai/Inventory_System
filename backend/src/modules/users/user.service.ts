import { prisma } from '../../config/db';
import { hashPassword } from '../../utils/password';
import { HttpError } from '../../core/HttpError';

export class UserService {
    async getAll() {
        const users = await prisma.user.findMany({
            include: { role: true },
        });
        return users.map(u => {
            const { passwordHash, ...rest } = u;
            return rest;
        });
    }

    async getById(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
        if (!user) throw new HttpError(404, 'User not found');
        const { passwordHash, ...rest } = user;
        return rest;
    }

    async create(data: any) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new HttpError(400, 'Email already exists');

        const hashedPassword = await hashPassword(data.password);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userData } = data;

        const user = await prisma.user.create({
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
