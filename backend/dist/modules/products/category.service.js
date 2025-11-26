"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const db_1 = require("../../config/db");
const HttpError_1 = require("../../core/HttpError");
class CategoryService {
    async getAll() {
        return await db_1.prisma.category.findMany();
    }
    async create(name) {
        const existing = await db_1.prisma.category.findUnique({ where: { name } });
        if (existing)
            throw new HttpError_1.HttpError(400, 'Category already exists');
        return await db_1.prisma.category.create({
            data: { name },
        });
    }
    async update(id, name) {
        const existing = await db_1.prisma.category.findUnique({ where: { id } });
        if (!existing)
            throw new HttpError_1.HttpError(404, 'Category not found');
        // Check name uniqueness if changed
        if (existing.name !== name) {
            const nameExists = await db_1.prisma.category.findUnique({ where: { name } });
            if (nameExists)
                throw new HttpError_1.HttpError(400, 'Category name already exists');
        }
        return await db_1.prisma.category.update({
            where: { id },
            data: { name },
        });
    }
    async delete(id) {
        // Check if used in products
        const count = await db_1.prisma.product.count({ where: { categoryId: id } });
        if (count > 0)
            throw new HttpError_1.HttpError(400, 'Cannot delete category with associated products');
        return await db_1.prisma.category.delete({ where: { id } });
    }
}
exports.CategoryService = CategoryService;
