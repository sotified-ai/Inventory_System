import { prisma } from '../../config/db';
import { HttpError } from '../../core/HttpError';
import { InventoryService } from '../inventory/inventory.service';
import { StockSourceType, PaymentType } from '@prisma/client';

const inventoryService = new InventoryService();

export class InvoiceService {
    async create(data: any, userId: number) {
        // data: { customerId, invoiceDate, deliveryManId, orderTakerId, paymentType, items: [{ productId, quantity, price }], discountAmount, remarks }

        return await prisma.$transaction(async (tx) => {
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
                await inventoryService.updateStock(
                    item.productId,
                    -item.quantity,
                    StockSourceType.invoice,
                    invoice.id,
                    `Invoice ${invoiceNo}`,
                    userId,
                    tx
                );
            }

            return invoice;
        });
    }

    async getAll() {
        return await prisma.invoice.findMany({
            include: { customer: true, deliveryMan: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getById(id: number) {
        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { customer: true, deliveryMan: true, items: { include: { product: true } } },
        });
        if (!invoice) throw new HttpError(404, 'Invoice not found');
        return invoice;
    }
}
