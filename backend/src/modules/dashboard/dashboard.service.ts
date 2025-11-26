import { prisma } from '../../config/db';

export class DashboardService {
    async getOverview() {
        // 1. Total Products
        const totalProducts = await prisma.product.count();

        // 2. Low Stock Items
        const lowStockResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM products p
      JOIN product_stock ps ON p.id = ps.product_id
      WHERE ps.quantity <= p.low_stock_level
    `;
        const lowStockItems = Number((lowStockResult as any)[0].count);

        // 3. Total Sales Count (Invoices)
        const totalSalesCount = await prisma.invoice.count({
            where: { status: { not: 'cancelled' } },
        });

        // 4. Financials (Aggregated from Invoices)
        const financials = await prisma.invoice.aggregate({
            where: { status: { not: 'cancelled' } },
            _sum: {
                totalAmount: true,
                discountAmount: true,
            },
        });

        const totalRevenue = financials._sum.totalAmount || 0;
        const netDiscount = financials._sum.discountAmount || 0;

        // 5. Net Profit (Revenue - Cost)
        const costResult = await prisma.$queryRaw`
      SELECT SUM(ii.quantity * p.purchase_price) as totalCost
      FROM invoice_items ii
      JOIN products p ON ii.product_id = p.id
      JOIN invoices i ON ii.invoice_id = i.id
      WHERE i.status != 'cancelled'
    `;
        const totalCost = (costResult as any)[0].totalCost || 0;
        const netProfit = Number(totalRevenue) - Number(totalCost);

        // 6. Total Credit (Outstanding)
        const creditInvoices = await prisma.invoice.aggregate({
            where: { status: { not: 'cancelled' }, paymentType: 'credit' },
            _sum: { totalAmount: true },
        });
        const totalCreditIssued = creditInvoices._sum.totalAmount || 0;

        const recoveries = await prisma.creditRecovery.aggregate({
            _sum: { amount: true },
        });
        const amountRecovered = recoveries._sum.amount || 0;

        const totalCreditOutstanding = Number(totalCreditIssued) - Number(amountRecovered);

        // 7. Transportation Cost
        const transport = await prisma.salesSummary.aggregate({
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
