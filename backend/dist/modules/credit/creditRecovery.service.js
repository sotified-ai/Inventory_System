"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditRecoveryService = void 0;
const db_1 = require("../../config/db");
class CreditRecoveryService {
    async create(data, userId) {
        // data: { invoiceId, customerId, deliveryManId, amount, method, summaryId? }
        return await db_1.prisma.$transaction(async (tx) => {
            const recovery = await tx.creditRecovery.create({
                data: {
                    invoiceId: data.invoiceId,
                    customerId: data.customerId,
                    deliveryManId: data.deliveryManId,
                    summaryId: data.summaryId,
                    amount: data.amount,
                    method: data.method,
                    receivedAt: new Date(),
                    createdById: userId,
                },
            });
            // If linked to summary, update summary recovery amount?
            // Logic to be refined based on strict requirements.
            return recovery;
        });
    }
    async getByCustomer(customerId) {
        return await db_1.prisma.creditRecovery.findMany({
            where: { customerId },
            include: { invoice: true },
        });
    }
}
exports.CreditRecoveryService = CreditRecoveryService;
