import { useRouter } from 'next/router';
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
    const router = useRouter();
    const isAdmin = user?.role === 'Admin';
    const navItems = isAdmin ? adminNav : operatorNav;

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <aside style={{
                width: '264px',
                background: 'var(--sidebar-bg)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'sticky', top: 0, alignSelf: 'flex-start', minHeight: '100vh',
                padding: '32px 20px', boxSizing: 'border-box', gap: '24px',
            }}>
                <div>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '4px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#fff', fontWeight: 800, fontSize: '17px',
                            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                        }}>F</div>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.2px' }}>Financial Tracking</div>
                            <div style={{ fontSize: '11px', color: 'var(--sidebar-text)', marginTop: '3px', fontWeight: 500 }}>{isAdmin ? 'Admin workspace' : 'Operator workspace'}</div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav style={{ display: 'grid', gap: '4px' }}>
                        {navItems.map(item => {
                            const active = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    style={{
                                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                        background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                                        color: active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                                        fontWeight: active ? 700 : 500,
                                        fontSize: '14px',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                    }}
                                    onMouseEnter={e => {
                                        if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#e2e8f0'; }
                                    }}
                                    onMouseLeave={e => {
                                        if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)'; }
                                    }}
                                >
                                    {active && (
                                        <div style={{
                                            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                            width: '3px', height: '20px', background: 'var(--primary-light)',
                                            borderRadius: '0 3px 3px 0',
                                        }} />
                                    )}
                                    <span style={{ fontSize: '17px', opacity: active ? 1 : 0.8 }}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* User + Logout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '4px' }}>
                        <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), #7c3aed)', color: '#fff',
                            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '14px',
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>{user?.name || 'User'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--sidebar-text)' }}>{user?.role || 'Member'}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', padding: '10px 14px', borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)', color: 'var(--sidebar-text)',
                            cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#e2e8f0'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--sidebar-text)'; }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '32px 36px', minHeight: '100vh' }}>
                {children}
            </main>
        </div>
    );
}
