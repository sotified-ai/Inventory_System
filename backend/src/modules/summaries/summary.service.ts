import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';

export class SummaryService {
    async getByDateAndDeliveryMan(date: string, deliveryManId: number) {
        return await prisma.salesSummary.findUnique({
            where: {
                uniq_dm_date: {
                    summaryDate: new Date(date),
                    deliveryManId,
                },
            },
            include: {
                invoices: { include: { invoice: true } },
                recoveries: true,
            },
        });
    }

    async createOrUpdate(data: any, userId: number) {
        // data: { deliveryManId, summaryDate, notes: { note10, note20... } }

        // This is a simplified version. Real logic involves aggregating linked invoices.
        // Assuming invoices are linked separately or passed here?
        // For now, let's just create the shell or update notes.

        const date = new Date(data.summaryDate);

        const existing = await prisma.salesSummary.findUnique({
            where: {
                uniq_dm_date: {
                    summaryDate: date,
                    deliveryManId: data.deliveryManId,
                },
            },
        });

        if (existing) {
            return await prisma.salesSummary.update({
                where: { id: existing.id },
                data: {
                    note10: data.notes?.note10,
                    note20: data.notes?.note20,
                    note50: data.notes?.note50,
                    note100: data.notes?.note100,
                    note500: data.notes?.note500,
                    note1000: data.notes?.note1000,
                    note5000: data.notes?.note5000,
                },
            });
        } else {
            return await prisma.salesSummary.create({
                data: {
                    deliveryManId: data.deliveryManId,
                    summaryDate: date,
                    createdById: userId,
                    note10: data.notes?.note10,
                    note20: data.notes?.note20,
                    note50: data.notes?.note50,
                    note100: data.notes?.note100,
                    note500: data.notes?.note500,
                    note1000: data.notes?.note1000,
                    note5000: data.notes?.note5000,
                },
            });
        }
    }

    async linkInvoice(summaryId: number, invoiceId: number, paymentData: any) {
        // paymentData: { cashAmount, creditAmount, ... }
        return await prisma.salesSummaryInvoice.create({
            data: {
                summaryId,
                invoiceId,
                paymentType: paymentData.paymentType,
                cashAmount: paymentData.cashAmount,
                creditAmount: paymentData.creditAmount,
                chequeAmount: paymentData.chequeAmount,
                returnAmount: paymentData.returnAmount,
            },
        });
        // TODO: Trigger recalculation of summary totals
    }
}
