import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Save } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    sellingPrice: number;
    productStock: { quantity: number };
}

interface Customer {
    id: number;
    name: string;
}

interface InvoiceItem {
    productId: number;
    quantity: number;
    price: number;
}

const CreateInvoice: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [formData, setFormData] = useState({
        customerId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        deliveryManId: 1, // Hardcoded for now, should be select
        orderTakerId: 1, // Hardcoded for now
        paymentType: 'cash',
        discountAmount: 0,
        remarks: ''
    });

    const [items, setItems] = useState<InvoiceItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, custRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/customers')
                ]);
                setProducts(prodRes.data);
                setCustomers(custRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const addItem = () => {
        setItems([...items, { productId: 0, quantity: 1, price: 0 }]);
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        const item = newItems[index];

        if (field === 'productId') {
            const product = products.find(p => p.id === Number(value));
            if (product) {
                item.productId = product.id;
                item.price = Number(product.sellingPrice);
            }
        } else {
            (item as any)[field] = Number(value);
        }
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        return subtotal - formData.discountAmount;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/invoices', {
                ...formData,
                customerId: Number(formData.customerId),
                items
            });
            navigate('/invoices');
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('Failed to create invoice');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Create Invoice</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Customer</label>
                        <select
                            value={formData.customerId}
                            onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={formData.invoiceDate}
                            onChange={e => setFormData({ ...formData, invoiceDate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Payment Type</label>
                        <select
                            value={formData.paymentType}
                            onChange={e => setFormData({ ...formData, paymentType: e.target.value })}
                        >
                            <option value="cash">Cash</option>
                            <option value="credit">Credit</option>
                        </select>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>Items</h3>
                        <button type="button" onClick={addItem} className="primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    <table style={{ marginBottom: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th style={{ width: '100px' }}>Qty</th>
                                <th style={{ width: '100px' }}>Price</th>
                                <th style={{ width: '100px' }}>Total</th>
                                <th style={{ width: '50px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <select
                                            value={item.productId}
                                            onChange={e => updateItem(index, 'productId', e.target.value)}
                                            required
                                        >
                                            <option value={0}>Select Product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} (Stock: {p.productStock?.quantity})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={e => updateItem(index, 'quantity', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    <td>
                                        <button type="button" onClick={() => removeItem(index)} style={{ color: 'var(--danger-color)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                        <div className="form-group">
                            <label>Discount</label>
                            <input
                                type="number"
                                value={formData.discountAmount}
                                onChange={e => setFormData({ ...formData, discountAmount: Number(e.target.value) })}
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <label>Total Amount</label>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                ${calculateTotal().toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="primary" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> Save Invoice
                </button>
            </form>
        </div>
    );
};

export default CreateInvoice;
