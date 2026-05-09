import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { mockDonors, mockProjects, mockDonations, monthlyData } from '../data.js';

const fmt = (n) => `Rs${n.toLocaleString('en-PK')}`;

function StatCard({ label, value, sub, subColor, icon, progress, progressPct }) {
  return (
    <div className="animate-fade" style={{
      background: '#fff', borderRadius: 'var(--radius)', padding: '24px',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</span>
        <span style={{ fontSize: '22px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '8px' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '13px', color: subColor || 'var(--accent)', fontWeight: '500' }}>{sub}</div>}
      {progress && (
        <>
          <div style={{ marginTop: '12px', height: '6px', background: '#e8eeff', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--primary)', borderRadius: '99px', transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{progressPct}% funded</div>
        </>
      )}
    </div>
  );
}

const DonutChart = ({ pct }) => {
  const r = 40, cx = 55, cy = 55, stroke = 8;
  const circ = 2 * Math.PI * r;
  const dash = (circ * pct) / 100;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffe0e2" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">{pct}%</text>
    </svg>
  );
};

export default function Dashboard({ onNavigate }) {
  const totalPledged = mockDonors.reduce((s, d) => s + d.pledged, 0);
  const totalReceived = mockDonors.reduce((s, d) => s + d.received, 0);
  const totalExpenses = mockProjects.reduce((s, p) => s + p.expenses, 0);
  const balance = totalReceived - totalExpenses;
  const fundedPct = Math.round((totalReceived / totalPledged) * 100);
  const expensePct = Math.round((totalExpenses / totalReceived) * 100);
  const activeDonors = mockDonors.filter(d => d.status === 'active').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ↺ Refresh
          </button>
          <button style={{ padding: '8px 18px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ↓ Export PDF
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <StatCard label="Total Donors" value={mockDonors.length} sub="↑ 12% MTD" icon="👥" />
        <StatCard label="Active Donors" value={activeDonors} sub="↑ 3% MTD" icon="✅" />
        <StatCard label="Total Donations" value={fmt(totalReceived)} icon="$" />
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard
          label="Pledged"
          value={fmt(totalPledged)}
          progress icon="📌"
          progressPct={fundedPct}
        />
        <div className="animate-fade" style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '12px' }}>Received</div>
          <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>{fmt(totalReceived)}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Balance</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>{fmt(balance)}</div>
        </div>
        <div className="animate-fade" style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '12px' }}>Expenses</div>
            <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>{fmt(totalExpenses)}</div>
          </div>
          <DonutChart pct={expensePct} />
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7a8bbf' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7a8bbf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip formatter={(v) => `Rs${v.toLocaleString()}`} />
              <Bar dataKey="donations" fill="#1a3faa" radius={[4,4,0,0]} name="Donations" />
              <Bar dataKey="expenses" fill="#f0384a" radius={[4,4,0,0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            {[['#1a3faa', 'Donations'], ['#f0384a', 'Expenses']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c }} /> {l}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Donation Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7a8bbf' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7a8bbf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip formatter={(v) => `Rs${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="donations" stroke="#00c48c" strokeWidth={2.5} dot={{ fill: '#00c48c', r: 4 }} name="Donations" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Balances */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Project Balances (Top 5)</h3>
          <button onClick={() => onNavigate('projects')} style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>View All Projects</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Project Name', 'Income', 'Expenses', 'Balance'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Project Name' ? 'left' : 'right', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockProjects.map(p => {
              const bal = p.income - p.expenses;
              const pct = (p.expenses / p.income) * 100;
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 12px', fontWeight: '600', fontSize: '14px' }}>{p.name}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: '14px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>{fmt(p.income)}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: '14px', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>{fmt(p.expenses)}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: '14px', fontWeight: '700', fontFamily: 'var(--mono)' }}>
                    <span style={{ color: pct > 80 ? 'var(--warning)' : 'var(--text)' }}>{fmt(bal)}</span>
                    {' '}{pct > 80 ? '⚠️' : '✓'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Donations */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Donations (Last 10)</h3>
          <button onClick={() => onNavigate('donations')} style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>View All Donations</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Date', 'Donor Name', 'Project', 'Amount'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Amount' ? 'right' : 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockDonations.slice(0, 10).map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>{d.date}</td>
                <td style={{ padding: '12px', fontWeight: '600', fontSize: '14px' }}>{d.donor}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>{d.project}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', fontFamily: 'var(--mono)', fontSize: '14px' }}>{fmt(d.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
