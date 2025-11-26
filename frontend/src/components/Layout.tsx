import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    Truck,
    LogOut,
    Menu
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/invoices', label: 'Invoices', icon: <FileText size={20} /> },
        { path: '/inventory', label: 'Inventory', icon: <Package size={20} /> },
        { path: '/warehouse', label: 'Warehouse', icon: <Truck size={20} /> },
        { path: '/customers', label: 'Customers', icon: <Users size={20} /> },
        { path: '/users', label: 'Users', icon: <Users size={20} />, role: 'Admin' },
    ];

    return (
        <div className="app-container">
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>SA Traders</h2>
                </div>
                <nav>
                    {navItems.map((item) => {
                        if (item.role && user?.role !== item.role) return null;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-btn">
                        <Menu size={24} />
                    </button>
                    <div className="user-info">
                        <span>{user?.name} ({user?.role})</span>
                    </div>
                </header>
                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
