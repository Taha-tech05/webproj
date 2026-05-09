import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'donors', label: 'Donors', icon: '👥' },
  { id: 'donations', label: 'Donations', icon: '💰' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'expenses', label: 'Expenses', icon: '📊' },
  { id: 'reports', label: 'Reports', icon: '📋' },
  { id: 'users', label: 'Users', icon: '👤' },
];

export default function Layout({ children, currentPage, onNavigate }) {
  const { user, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 0 #e2e8f4',
      }}>
        <div style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '0 24px', height: '60px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '16px' }}>
            <div style={{
              width: '34px', height: '34px', background: 'var(--primary)',
              borderRadius: '9px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '15px',
            }}>F</div>
            <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text)', letterSpacing: '-0.3px' }}>
              Financial Tracking
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)} style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: currentPage === item.id ? 'var(--primary)' : 'transparent',
                color: currentPage === item.id ? '#fff' : 'var(--text-muted)',
                fontWeight: currentPage === item.id ? '600' : '500',
                fontSize: '13.5px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '18px', padding: '6px' }}>⚙</button>
            <div style={{ position: 'relative' }}>
              <div onClick={() => setDropOpen(!dropOpen)} style={{
                display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                padding: '6px 10px', borderRadius: '10px',
                background: dropOpen ? '#f0f4ff' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'var(--primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '14px',
                }}>
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text)' }}>{user?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.role}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>▾</span>
              </div>
              {dropOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '48px',
                  background: '#fff', border: '1px solid var(--border)',
                  borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
                  minWidth: '180px', padding: '8px', zIndex: 200,
                }}>
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{user?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                  <button onClick={() => { setDropOpen(false); logout(); }} style={{
                    width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                    textAlign: 'left', borderRadius: '8px', color: 'var(--danger)',
                    fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                  }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </main>
    </div>
  );
}
