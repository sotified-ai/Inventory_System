import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';

export class ProductService {
    async getAll() {
        return await prisma.product.findMany({
            include: {
                category: true,
                productStock: true,
            },
        });
    }

    async getById(id: number) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                productStock: true,
            },
        });
        if (!product) throw new HttpError(404, 'Product not found');
        return product;
    }

    async create(data: any, userId: number) {
        const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
        if (existing) throw new HttpError(400, 'SKU already exists');

        // Transaction to create product and initial stock entry
        return await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    categoryId: data.categoryId,
                    name: data.name,
                    sku: data.sku,
                    sellingPrice: data.sellingPrice,
                    purchasePrice: data.purchasePrice,
                    lowStockLevel: data.lowStockLevel,
                    cartonSize: data.cartonSize,
                    createdById: userId,
                },
            });

            // Initialize stock at 0
            await tx.productStock.create({
                data: {
                    productId: product.id,
                    quantity: 0,
                },
            });

            return product;
        });
    }

    async update(id: number, data: any) {
        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) throw new HttpError(404, 'Product not found');

        if (data.sku && data.sku !== existing.sku) {
            const skuExists = await prisma.product.findUnique({ where: { sku: data.sku } });
            if (skuExists) throw new HttpError(400, 'SKU already exists');
        }

        return await prisma.product.update({
            where: { id },
            data: {
                categoryId: data.categoryId,
                name: data.name,
                sku: data.sku,
                sellingPrice: data.sellingPrice,
                purchasePrice: data.purchasePrice,
                lowStockLevel: data.lowStockLevel,
                cartonSize: data.cartonSize,
            },
        });
    }
}
