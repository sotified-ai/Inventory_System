import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';

export class CreditRecoveryService {
    async create(data: any, userId: number) {
        // data: { invoiceId, customerId, deliveryManId, amount, method, summaryId? }

        return await prisma.$transaction(async (tx) => {
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

    async getByCustomer(customerId: number) {
        return await prisma.creditRecovery.findMany({
            where: { customerId },
            include: { invoice: true },
        });
    }
}
