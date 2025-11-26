"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const db_1 = require("../../config/db");
const HttpError_1 = require("../../core/HttpError");
class CustomerService {
    async getAll() {
        return await db_1.prisma.customer.findMany();
    }
    async getById(id) {
        const customer = await db_1.prisma.customer.findUnique({ where: { id } });
        if (!customer)
            throw new HttpError_1.HttpError(404, 'Customer not found');
        return customer;
    }
    async create(data) {
        return await db_1.prisma.customer.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        });
    }
    async update(id, data) {
        const existing = await db_1.prisma.customer.findUnique({ where: { id } });
        if (!existing)
            throw new HttpError_1.HttpError(404, 'Customer not found');
        return await db_1.prisma.customer.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
            },
        });
    }
}
exports.CustomerService = CustomerService;
