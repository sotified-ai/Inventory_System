import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Invoice {
    id: number;
    invoiceNo: string;
    customer: { name: string };
    totalAmount: string;
    status: string;
    invoiceDate: string;
}

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Invoices</h1>
                <Link to="/invoices/new" className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
                    <Plus size={16} /> Create Invoice
                </Link>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.invoiceNo}</td>
                                <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                <td>{invoice.customer?.name}</td>
                                <td>${Number(invoice.totalAmount).toFixed(2)}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: invoice.status === 'submitted' ? '#dcfce7' : '#f3f4f6',
                                        color: invoice.status === 'submitted' ? '#166534' : '#374151'
                                    }}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
