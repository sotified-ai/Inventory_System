import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';
import { InventoryService } from '../inventory/inventory.service';
import { StockSourceType, WarehouseSheetStatus } from '@prisma/client';

const inventoryService = new InventoryService();

export class WarehouseService {
    async createLoadSheet(data: any, userId: number) {
        // data: { deliveryManId, issueDate, items: [{ productId, qtyIssued }] }

        return await prisma.$transaction(async (tx) => {
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

    async issueLoadSheet(id: number, userId: number) {
        return await prisma.$transaction(async (tx) => {
            const sheet = await tx.warehouseLoadSheet.findUnique({
                where: { id },
                include: { items: true },
            });

            if (!sheet) throw new HttpError(404, 'Load sheet not found');
            if (sheet.status !== 'draft') throw new HttpError(400, 'Sheet is not in draft status');

            // Deduct stock for each item
            for (const item of sheet.items) {
                await inventoryService.updateStock(
                    item.productId,
                    -item.qtyIssued, // Negative for issue
                    StockSourceType.warehouse_issue,
                    sheet.id,
                    `Load Sheet ${sheet.sheetNo}`,
                    userId,
                    tx
                );
            }

            // Update status
            return await tx.warehouseLoadSheet.update({
                where: { id },
                data: { status: 'issued' },
            });
        });
    }

    async getAll() {
        return await prisma.warehouseLoadSheet.findMany({
            include: { deliveryMan: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
}
