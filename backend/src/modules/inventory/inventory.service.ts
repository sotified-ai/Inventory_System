import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';
import { StockSourceType } from '@prisma/client';

export class InventoryService {
    /**
     * Updates stock for a product and creates a ledger entry.
     * MUST be called within a transaction if part of a larger operation.
     * If tx is provided, uses it; otherwise creates a new transaction.
     */
    async updateStock(
        productId: number,
        qtyChange: number,
        sourceType: StockSourceType,
        sourceId: number,
        reason: string | null,
        userId: number,
        tx?: any // PrismaTransaction
    ) {
        const operation = async (prismaTx: any) => {
            // 1. Get current stock (lock row if possible, but Prisma doesn't support SELECT FOR UPDATE easily without raw query. 
            // For now, we rely on atomic update for quantity, but we need 'before' qty for ledger)

            const currentStock = await prismaTx.productStock.findUnique({
                where: { productId },
            });

            if (!currentStock) {
                throw new HttpError(404, `Product stock not found for product ${productId}`);
            }

            const beforeQty = currentStock.quantity;
            const afterQty = beforeQty + qtyChange;

            if (afterQty < 0) {
                throw new HttpError(400, `Insufficient stock for product ${productId}. Current: ${beforeQty}, Requested reduction: ${Math.abs(qtyChange)}`);
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
        } else {
            return await prisma.$transaction(operation);
        }
    }

    async getLedger(productId: number) {
        return await prisma.stockLedger.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: { createdBy: true },
        });
    }
}
