import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'donors', label: 'Donors', icon: '👥' },
    { id: 'donations', label: 'Donations', icon: '💰' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'expenses', label: 'Expenses', icon: '📊' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👤' },
];

const operatorNav = [
    { id: 'operator-dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'donors', label: 'Donors', icon: '👥' },
    { id: 'donations', label: 'Donations', icon: '💰' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'expenses', label: 'Expenses', icon: '📊' },
];

export default function Layout({ children, currentPage, onNavigate }) {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'Admin';
    const navItems = isAdmin ? adminNav : operatorNav;
    const [showLogout, setShowLogout] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <aside style={{
                width: '260px', background: '#fff', borderRight: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'sticky', top: 0, alignSelf: 'flex-start', minHeight: '100vh',
                padding: '28px 20px', boxSizing: 'border-box', gap: '24px',
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '12px',
                            background: 'var(--primary)', display: 'flex', justifyContent: 'center',
                            alignItems: 'center', color: '#fff', fontWeight: 800, fontSize: '16px',
                        }}>F</div>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text)' }}>Financial Tracking</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{isAdmin ? 'Admin workspace' : 'Operator workspace'}</div>
                        </div>
                    </div>

                    <nav style={{ display: 'grid', gap: '8px' }}>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                style={{
                                    width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                    background: currentPage === item.id ? 'var(--primary)' : 'transparent',
                                    color: currentPage === item.id ? '#fff' : 'var(--text)',
                                    fontWeight: currentPage === item.id ? 700 : 500,
                                }}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center',
                            fontWeight: 700,
                        }}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>{user?.name || 'User'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.role || 'Member'}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); }}
                        style={{
                            width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)',
                            background: '#fff', color: 'var(--text)', cursor: 'pointer', fontWeight: 600,
                        }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '28px 32px', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}
