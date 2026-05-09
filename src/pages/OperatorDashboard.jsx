import { useStore } from '../store.js';
import { useAuth } from '../AuthContext.jsx';
import { fmt, StatCard } from '../components/UI.jsx';
import { Badge } from '../components/UI.jsx';

export default function OperatorDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { donations, expenses, donors, projects } = useStore();

  const myDonations = donations.filter(d => d.enteredBy === user?.name || !d.enteredBy);
  const pendingDonations = donations.filter(d => d.status === 'pending');
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayDonations = donations.filter(d => d.date === todayStr);
  const totalReceived = donations.filter(d => d.status === 'paid').reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2570, #1a3faa)',
        borderRadius: 'var(--radius)', padding: '28px 32px', marginBottom: '28px',
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '13px', opacity: 0.75, marginBottom: '6px' }}>
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ opacity: 0.75, fontSize: '14px' }}>Data Entry Operator — Financial Tracking System</p>
        </div>
        <div style={{ fontSize: '64px' }}>📊</div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Donations" value={donations.length} sub="All recorded entries" icon="💰" />
        <StatCard label="Pending Donations" value={pendingDonations.length} sub="Awaiting payment" subColor="var(--warning)" icon="⏳" />
        <StatCard label="Total Received" value={fmt(totalReceived)} sub="Paid donations" icon="✅" />
        <StatCard label="Total Expenses" value={expenses.length} sub="All expense entries" icon="📋" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '💰', label: 'Record New Donation', desc: 'Add a donation entry', page: 'donations', color: '#1a3faa', bg: '#f0f4ff' },
              { icon: '📊', label: 'Record New Expense', desc: 'Log a project expense', page: 'expenses', color: '#00875a', bg: '#e8faf4' },
              { icon: '👥', label: 'View Donors', desc: 'Browse donor list', page: 'donors', color: '#7b2d8b', bg: '#f8f0fc' },
              { icon: '📁', label: 'View Projects', desc: 'See project balances', page: 'projects', color: '#b07d00', bg: '#fff8e6' },
            ].map(item => (
              <div key={item.page} onClick={() => onNavigate(item.page)} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                borderRadius: '10px', background: item.bg, cursor: 'pointer',
                border: `1px solid ${item.color}20`, transition: 'transform 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', color: item.color, fontSize: '16px' }}>→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Pending Donations */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Pending Donations</h3>
            <button onClick={() => onNavigate('donations')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View all →</button>
          </div>
          {pendingDonations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
              <div style={{ fontWeight: '600' }}>All caught up!</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>No pending donations</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingDonations.slice(0, 5).map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff8e6', borderRadius: '8px', border: '1px solid #ffe0a0' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{d.donor}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.project} · {d.month}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', fontFamily: 'var(--mono)', textAlign: 'right' }}>{fmt(d.amount)}</div>
                    <Badge status="pending" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Donations Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Activity (Last 5 Donations)</h3>
          <button onClick={() => onNavigate('donations')} style={{ fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>View all →</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafbfe' }}>
              {['Date', 'Donor', 'Project', 'Month', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Amount' ? 'right' : 'left', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.slice(0, 5).map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{d.date}</td>
                <td style={{ padding: '12px 14px', fontWeight: '600', fontSize: '14px' }}>{d.donor}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>{d.project}</td>
                <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>{d.month}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700', fontFamily: 'var(--mono)', fontSize: '14px' }}>{fmt(d.amount)}</td>
                <td style={{ padding: '12px 14px' }}><Badge status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
