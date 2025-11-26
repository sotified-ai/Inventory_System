"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryService = void 0;
const db_1 = require("../../config/db");
class SummaryService {
    async getByDateAndDeliveryMan(date, deliveryManId) {
        return await db_1.prisma.salesSummary.findUnique({
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
    async createOrUpdate(data, userId) {
        // data: { deliveryManId, summaryDate, notes: { note10, note20... } }
        // This is a simplified version. Real logic involves aggregating linked invoices.
        // Assuming invoices are linked separately or passed here?
        // For now, let's just create the shell or update notes.
        const date = new Date(data.summaryDate);
        const existing = await db_1.prisma.salesSummary.findUnique({
            where: {
                uniq_dm_date: {
                    summaryDate: date,
                    deliveryManId: data.deliveryManId,
                },
            },
        });
        if (existing) {
            return await db_1.prisma.salesSummary.update({
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
        }
        else {
            return await db_1.prisma.salesSummary.create({
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
    async linkInvoice(summaryId, invoiceId, paymentData) {
        // paymentData: { cashAmount, creditAmount, ... }
        return await db_1.prisma.salesSummaryInvoice.create({
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
exports.SummaryService = SummaryService;
