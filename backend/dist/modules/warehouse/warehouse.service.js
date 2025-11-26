"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const db_1 = require("../../config/db");
const HttpError_1 = require("../../core/HttpError");
const inventory_service_1 = require("../inventory/inventory.service");
const client_1 = require("@prisma/client");
const inventoryService = new inventory_service_1.InventoryService();
class WarehouseService {
    async createLoadSheet(data, userId) {
        // data: { deliveryManId, issueDate, items: [{ productId, qtyIssued }] }
        return await db_1.prisma.$transaction(async (tx) => {
            // 1. Create Sheet
            // Generate sheetNo (e.g., WS-TIMESTAMP)
            const sheetNo = `WS-${Date.now()}`;
            const sheet = await tx.warehouseLoadSheet.create({
                data: {
                    sheetNo,
                    deliveryManId: data.deliveryManId,
                    issueDate: new Date(data.issueDate),
                    status: 'draft',
                    createdById: userId,
                },
            });
            // 2. Create Items
            for (const item of data.items) {
                await tx.warehouseLoadItem.create({
                    data: {
                        sheetId: sheet.id,
                        productId: item.productId,
                        qtyIssued: item.qtyIssued,
                    },
                });
            }
            return sheet;
        });
    }
    async issueLoadSheet(id, userId) {
        return await db_1.prisma.$transaction(async (tx) => {
            const sheet = await tx.warehouseLoadSheet.findUnique({
                where: { id },
                include: { items: true },
            });
            if (!sheet)
                throw new HttpError_1.HttpError(404, 'Load sheet not found');
            if (sheet.status !== 'draft')
                throw new HttpError_1.HttpError(400, 'Sheet is not in draft status');
            // Deduct stock for each item
            for (const item of sheet.items) {
                await inventoryService.updateStock(item.productId, -item.qtyIssued, // Negative for issue
                client_1.StockSourceType.warehouse_issue, sheet.id, `Load Sheet ${sheet.sheetNo}`, userId, tx);
            }
            // Update status
            return await tx.warehouseLoadSheet.update({
                where: { id },
                data: { status: 'issued' },
            });
        });
    }
    async getAll() {
        return await db_1.prisma.warehouseLoadSheet.findMany({
            include: { deliveryMan: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.WarehouseService = WarehouseService;
