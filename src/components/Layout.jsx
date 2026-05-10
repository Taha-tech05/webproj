import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext.jsx';
import Footer from './Footer.jsx';

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['Admin'] },
    { id: 'donors', label: 'Donors', icon: 'donors', roles: ['Admin', 'Operator'] },
    { id: 'donations', label: 'Donations', icon: 'donations', roles: ['Admin', 'Operator'] },
    { id: 'projects', label: 'Projects', icon: 'projects', roles: ['Admin'] },
    { id: 'expenses', label: 'Expenses', icon: 'expenses', roles: ['Admin', 'Operator'] },
    { id: 'reports', label: 'Reports', icon: 'reports', roles: ['Admin'] },
    { id: 'users', label: 'Users', icon: 'users', roles: ['Admin'] },
];

function NavIcon({ name, active }) {
    const color = active ? 'var(--sidebar-active-text)' : 'currentColor';
    const common = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const icons = {
        dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" {...common} /><rect x="14" y="3" width="7" height="7" rx="1.5" {...common} /><rect x="3" y="14" width="7" height="7" rx="1.5" {...common} /><path d="M14 17h7M17.5 13.5v7" {...common} /></>,
        donors: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...common} /><circle cx="9" cy="7" r="4" {...common} /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" {...common} /></>,
        donations: <><rect x="3" y="6" width="18" height="12" rx="2" {...common} /><circle cx="12" cy="12" r="2.5" {...common} /><path d="M6 10v4M18 10v4" {...common} /></>,
        projects: <><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" {...common} /></>,
        expenses: <><path d="M4 19V5M4 19h16" {...common} /><rect x="7" y="11" width="3" height="5" rx="1" {...common} /><rect x="12" y="7" width="3" height="9" rx="1" {...common} /><rect x="17" y="9" width="3" height="7" rx="1" {...common} /></>,
        reports: <><path d="M6 3h9l3 3v15H6z" {...common} /><path d="M14 3v4h4M9 14h6M9 18h6M9 10h2" {...common} /></>,
        users: <><circle cx="12" cy="7" r="4" {...common} /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" {...common} /><path d="M19 8h3M20.5 6.5v3" {...common} /></>,
    };

    return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;
}

export default function Layout({ children, currentPage, onNavigate }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const isAdmin = user?.role === 'Admin';
    const visibleNavItems = navItems.filter(item => item.roles.includes(user?.role));

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '4px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: '#fff', fontWeight: 800, fontSize: '17px',
                            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                        }}>F</div>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>Financial Tracking</div>
                            <div style={{ fontSize: '11px', color: 'var(--sidebar-text)', marginTop: '3px', fontWeight: 500 }}>{isAdmin ? 'Admin workspace' : 'Data entry workspace'}</div>
                        </div>
                    </div>

                    <nav style={{ display: 'grid', gap: '4px' }}>
                        {visibleNavItems.map(item => {
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
                                    <span style={{ width: '18px', height: '18px', display: 'inline-flex', opacity: active ? 1 : 0.82 }}>
                                        <NavIcon name={item.icon} active={active} />
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

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

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
                <div style={{ padding: '32px 36px', flex: 1 }}>
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}
