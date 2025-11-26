"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const db_1 = require("../../config/db");
const HttpError_1 = require("../../core/HttpError");
class ProductService {
    async getAll() {
        return await db_1.prisma.product.findMany({
            include: {
                category: true,
                productStock: true,
            },
        });
    }
    async getById(id) {
        const product = await db_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                productStock: true,
            },
        });
        if (!product)
            throw new HttpError_1.HttpError(404, 'Product not found');
        return product;
    }
    async create(data, userId) {
        const existing = await db_1.prisma.product.findUnique({ where: { sku: data.sku } });
        if (existing)
            throw new HttpError_1.HttpError(400, 'SKU already exists');
        // Transaction to create product and initial stock entry
        return await db_1.prisma.$transaction(async (tx) => {
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
    async update(id, data) {
        const existing = await db_1.prisma.product.findUnique({ where: { id } });
        if (!existing)
            throw new HttpError_1.HttpError(404, 'Product not found');
        if (data.sku && data.sku !== existing.sku) {
            const skuExists = await db_1.prisma.product.findUnique({ where: { sku: data.sku } });
            if (skuExists)
                throw new HttpError_1.HttpError(400, 'SKU already exists');
        }
        return await db_1.prisma.product.update({
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
exports.ProductService = ProductService;
