"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const db_1 = require("../../config/db");
const HttpError_1 = require("../../core/HttpError");
const inventory_service_1 = require("../inventory/inventory.service");
const client_1 = require("@prisma/client");
const inventoryService = new inventory_service_1.InventoryService();
class InvoiceService {
    async create(data, userId) {
        // data: { customerId, invoiceDate, deliveryManId, orderTakerId, paymentType, items: [{ productId, quantity, price }], discountAmount, remarks }
        return await db_1.prisma.$transaction(async (tx) => {
            // 1. Calculate totals
            let subtotal = 0;
            const itemsToCreate = [];
            for (const item of data.items) {
                const lineTotal = item.quantity * item.price;
                subtotal += lineTotal;
                itemsToCreate.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    lineTotal,
                });
            }
            const totalAmount = subtotal - (data.discountAmount || 0);
            // 2. Create Invoice
            const invoiceNo = `INV-${Date.now()}`;
            const invoice = await tx.invoice.create({
                data: {
                    invoiceNo,
                    customerId: data.customerId,
                    invoiceDate: new Date(data.invoiceDate),
                    deliveryManId: data.deliveryManId,
                    orderTakerId: data.orderTakerId,
                    paymentType: data.paymentType,
                    subtotalAmount: subtotal,
                    discountAmount: data.discountAmount || 0,
                    totalAmount,
                    remarks: data.remarks,
                    createdById: userId,
                    status: 'submitted', // Direct submit as per rules? Or draft? Schema says default submitted.
                },
            });
            // 3. Create Items
            for (const item of itemsToCreate) {
                await tx.invoiceItem.create({
                    data: {
                        invoiceId: invoice.id,
                        ...item,
                    },
                });
                // 4. Deduct Stock
                await inventoryService.updateStock(item.productId, -item.quantity, client_1.StockSourceType.invoice, invoice.id, `Invoice ${invoiceNo}`, userId, tx);
            }
            return invoice;
        });
    }
    async getAll() {
        return await db_1.prisma.invoice.findMany({
            include: { customer: true, deliveryMan: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id) {
        const invoice = await db_1.prisma.invoice.findUnique({
            where: { id },
            include: { customer: true, deliveryMan: true, items: { include: { product: true } } },
        });
        if (!invoice)
            throw new HttpError_1.HttpError(404, 'Invoice not found');
        return invoice;
    }
}
exports.InvoiceService = InvoiceService;
