import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';

export class CategoryService {
    async getAll() {
        return await prisma.category.findMany();
    }

    async create(name: string) {
        const existing = await prisma.category.findUnique({ where: { name } });
        if (existing) throw new HttpError(400, 'Category already exists');

        return await prisma.category.create({
            data: { name },
        });
    }

    async update(id: number, name: string) {
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) throw new HttpError(404, 'Category not found');

        // Check name uniqueness if changed
        if (existing.name !== name) {
            const nameExists = await prisma.category.findUnique({ where: { name } });
            if (nameExists) throw new HttpError(400, 'Category name already exists');
        }

        return await prisma.category.update({
            where: { id },
            data: { name },
        });
    }

    async delete(id: number) {
        // Check if used in products
        const count = await prisma.product.count({ where: { categoryId: id } });
        if (count > 0) throw new HttpError(400, 'Cannot delete category with associated products');

        return await prisma.category.delete({ where: { id } });
    }
}
