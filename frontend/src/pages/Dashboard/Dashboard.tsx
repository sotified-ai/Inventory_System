import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    AlertTriangle,
    CreditCard,
    Truck
} from 'lucide-react';

interface DashboardData {
    totalProducts: number;
    lowStockItems: number;
    totalSalesCount: number;
    totalRevenue: number;
    netProfit: number;
    netDiscount: number;
    totalCredit: number;
    transportationCost: number;
    amountRecovered: number;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/overview');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Error loading data</div>;

    const cards = [
        { label: 'Total Revenue', value: `$${Number(data.totalRevenue).toFixed(2)}`, icon: <DollarSign />, color: 'text-green-600' },
        { label: 'Net Profit', value: `$${Number(data.netProfit).toFixed(2)}`, icon: <TrendingUp />, color: 'text-blue-600' },
        { label: 'Total Sales', value: data.totalSalesCount, icon: <ShoppingCart />, color: 'text-purple-600' },
        { label: 'Total Products', value: data.totalProducts, icon: <Package />, color: 'text-gray-600' },
        { label: 'Low Stock Items', value: data.lowStockItems, icon: <AlertTriangle />, color: 'text-red-600' },
        { label: 'Credit Outstanding', value: `$${Number(data.totalCredit).toFixed(2)}`, icon: <CreditCard />, color: 'text-orange-600' },
        { label: 'Recovered Amount', value: `$${Number(data.amountRecovered).toFixed(2)}`, icon: <DollarSign />, color: 'text-green-500' },
        { label: 'Transport Cost', value: `$${Number(data.transportationCost).toFixed(2)}`, icon: <Truck />, color: 'text-yellow-600' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h1>
            <div className="dashboard-grid">
                {cards.map((card, index) => (
                    <div key={index} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3>{card.label}</h3>
                            <span className={card.color}>{card.icon}</span>
                        </div>
                        <div className="value">{card.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
