import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, CheckCircle } from 'lucide-react';

interface LoadSheet {
    id: number;
    sheetNo: string;
    deliveryMan: { name: string };
    issueDate: string;
    status: string;
}

const Warehouse: React.FC = () => {
    const [sheets, setSheets] = useState<LoadSheet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSheets();
    }, []);

    const fetchSheets = async () => {
        try {
            const response = await api.get('/warehouse');
            setSheets(response.data);
        } catch (error) {
            console.error('Error fetching load sheets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssue = async (id: number) => {
        try {
            await api.post(`/warehouse/${id}/issue`);
            fetchSheets();
        } catch (error) {
            console.error('Error issuing sheet:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Warehouse Load Sheets</h1>
                <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={16} /> Create Load Sheet
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sheet #</th>
                            <th>Date</th>
                            <th>Delivery Man</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sheets.map((sheet) => (
                            <tr key={sheet.id}>
                                <td>{sheet.sheetNo}</td>
                                <td>{new Date(sheet.issueDate).toLocaleDateString()}</td>
                                <td>{sheet.deliveryMan?.name}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: sheet.status === 'issued' ? '#dcfce7' : '#fef9c3',
                                        color: sheet.status === 'issued' ? '#166534' : '#854d0e'
                                    }}>
                                        {sheet.status}
                                    </span>
                                </td>
                                <td>
                                    {sheet.status === 'draft' && (
                                        <button
                                            onClick={() => handleIssue(sheet.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success-color)' }}
                                            title="Issue Stock"
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Warehouse;
