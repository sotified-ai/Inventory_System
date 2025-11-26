"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const db_1 = require("../../config/db");
const HttpError_1 = require("../../core/HttpError");
class InventoryService {
    /**
     * Updates stock for a product and creates a ledger entry.
     * MUST be called within a transaction if part of a larger operation.
     * If tx is provided, uses it; otherwise creates a new transaction.
     */
    async updateStock(productId, qtyChange, sourceType, sourceId, reason, userId, tx // PrismaTransaction
    ) {
        const operation = async (prismaTx) => {
            // 1. Get current stock (lock row if possible, but Prisma doesn't support SELECT FOR UPDATE easily without raw query. 
            // For now, we rely on atomic update for quantity, but we need 'before' qty for ledger)
            const currentStock = await prismaTx.productStock.findUnique({
                where: { productId },
            });
            if (!currentStock) {
                throw new HttpError_1.HttpError(404, `Product stock not found for product ${productId}`);
            }
            const beforeQty = currentStock.quantity;
            const afterQty = beforeQty + qtyChange;
            if (afterQty < 0) {
                throw new HttpError_1.HttpError(400, `Insufficient stock for product ${productId}. Current: ${beforeQty}, Requested reduction: ${Math.abs(qtyChange)}`);
            }
            // 2. Update ProductStock
            await prismaTx.productStock.update({
                where: { productId },
                data: { quantity: afterQty },
            });
            // 3. Create StockLedger entry
            await prismaTx.stockLedger.create({
                data: {
                    productId,
                    qtyChange,
                    beforeQty,
                    afterQty,
                    sourceType,
                    sourceId,
                    reason,
                    createdById: userId,
                },
            });
            return afterQty;
        };
        if (tx) {
            return await operation(tx);
        }
        else {
            return await db_1.prisma.$transaction(operation);
        }
    }
    async getLedger(productId) {
        return await db_1.prisma.stockLedger.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: { createdBy: true },
        });
    }
}
exports.InventoryService = InventoryService;
