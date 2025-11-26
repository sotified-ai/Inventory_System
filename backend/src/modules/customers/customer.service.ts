import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';

export class CustomerService {
    async getAll() {
        return await prisma.customer.findMany();
    }

    async getById(id: number) {
        const customer = await prisma.customer.findUnique({ where: { id } });
        if (!customer) throw new HttpError(404, 'Customer not found');
        return customer;
    }

    async create(data: any) {
        return await prisma.customer.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        });
    }

    async update(id: number, data: any) {
        const existing = await prisma.customer.findUnique({ where: { id } });
        if (!existing) throw new HttpError(404, 'Customer not found');

        return await prisma.customer.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        });
    }
}
