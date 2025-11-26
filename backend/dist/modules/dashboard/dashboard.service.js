"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = require("../../config/db");
class DashboardService {
    async getOverview() {
        // 1. Total Products
        const totalProducts = await db_1.prisma.product.count();
        // 2. Low Stock Items
        const lowStockResult = await db_1.prisma.$queryRaw `
      SELECT COUNT(*) as count
      FROM products p
      JOIN product_stock ps ON p.id = ps.product_id
      WHERE ps.quantity <= p.low_stock_level
    `;
        const lowStockItems = Number(lowStockResult[0].count);
        // 3. Total Sales Count (Invoices)
        const totalSalesCount = await db_1.prisma.invoice.count({
            where: { status: { not: 'cancelled' } },
        });
        // 4. Financials (Aggregated from Invoices)
        const financials = await db_1.prisma.invoice.aggregate({
            where: { status: { not: 'cancelled' } },
            _sum: {
                totalAmount: true,
                discountAmount: true,
            },
        });
        const totalRevenue = financials._sum.totalAmount || 0;
        const netDiscount = financials._sum.discountAmount || 0;
        // 5. Net Profit (Revenue - Cost)
        const costResult = await db_1.prisma.$queryRaw `
      SELECT SUM(ii.quantity * p.purchase_price) as totalCost
      FROM invoice_items ii
      JOIN products p ON ii.product_id = p.id
      JOIN invoices i ON ii.invoice_id = i.id
      WHERE i.status != 'cancelled'
    `;
        const totalCost = costResult[0].totalCost || 0;
        const netProfit = Number(totalRevenue) - Number(totalCost);
        // 6. Total Credit (Outstanding)
        const creditInvoices = await db_1.prisma.invoice.aggregate({
            where: { status: { not: 'cancelled' }, paymentType: 'credit' },
            _sum: { totalAmount: true },
        });
        const totalCreditIssued = creditInvoices._sum.totalAmount || 0;
        const recoveries = await db_1.prisma.creditRecovery.aggregate({
            _sum: { amount: true },
        });
        const amountRecovered = recoveries._sum.amount || 0;
        const totalCreditOutstanding = Number(totalCreditIssued) - Number(amountRecovered);
        // 7. Transportation Cost
        const transport = await db_1.prisma.salesSummary.aggregate({
            _sum: { transporterCost: true },
        });
        const transportationCost = transport._sum.transporterCost || 0;
        return {
            totalProducts,
            lowStockItems,
            totalSalesCount,
            totalRevenue,
            netProfit,
            netDiscount,
            totalCredit: totalCreditOutstanding,
            transportationCost,
            amountRecovered,
        };
    }
}
exports.DashboardService = DashboardService;
