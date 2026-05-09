import { useAuth } from '../../AuthContext.jsx';
import { useStore } from '../../store.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const fmt = (n) => `Rs${n?.toLocaleString('en-PK') || 0}`;

function StatCard({ label, value, sub, subColor, icon }) {
    return (
        <div className="animate-fade" style={{
            background: '#fff', borderRadius: 'var(--radius)', padding: '24px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</span>
                <span style={{ fontSize: '22px' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px', marginBottom: '8px' }}>{value}</div>
            {sub && <div style={{ fontSize: '13px', color: subColor || 'var(--accent)', fontWeight: '500' }}>{sub}</div>}
        </div>
    );
}

const DonutChart = ({ pct }) => {
    const r = 40, cx = 55, cy = 55, stroke = 8;
    const circ = 2 * Math.PI * r;
    const dash = (circ * pct) / 100;
    return (
        <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0e7ff" strokeWidth={stroke} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`} />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--text)">{pct}%</text>
        </svg>
    );
};

export default function Dashboard() {
    const { user } = useAuth();
    const { donors, projects, donations } = useStore();

    if (!user) return null;

    const totalPledged = donors.reduce((s, d) => s + (Number(d.pledged) || 0), 0);
    const totalReceived = donors.reduce((s, d) => s + (Number(d.received) || 0), 0);
    const totalExpenses = projects.reduce((s, p) => s + (Number(p.expenses) || 0), 0);
    const totalBudget = projects.reduce((s, p) => s + (Number(p.budget) || 0), 0);
    const fundingPct = totalPledged > 0 ? Math.round((totalReceived / totalPledged) * 100) : 0;
    const expensePct = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

    // Monthly aggregation
    const monthlyDataMap = {};
    donations.forEach(d => {
        const amt = Number(d.amount);
        monthlyDataMap[d.month] = (monthlyDataMap[d.month] || 0) + amt;
    });
    const monthlyData = Object.entries(monthlyDataMap).map(([month, amount]) => ({ month, donations: amount }));

    return (
        <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)', marginBottom: '32px', letterSpacing: '-0.5px' }}>
                Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', marginTop: '-20px' }}>
                Welcome back, {user.name}. You are logged in as {user.role}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatCard label="Total Pledged" value={fmt(totalPledged)} icon="💰" />
                <StatCard label="Total Received" value={fmt(totalReceived)} sub={`${fundingPct}% of pledged`} icon="✓" />
                <StatCard label="Active Projects" value={projects.filter(p => p.status === 'active').length} icon="📁" />
                <StatCard label="Total Expenses" value={fmt(totalExpenses)} icon="📊" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>Monthly Trend</h3>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)' }} />
                                <Line type="monotone" dataKey="donations" stroke="var(--primary)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px' }}>No donation data available.</p>}
                </div>
                <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>Project Funding</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={projects}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="name" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)' }} />
                            <Bar dataKey="expenses" fill="var(--primary)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>Recent Donors</h3>
                    {donors.slice(0, 3).map(donor => (
                        <div key={donor.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{donor.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{fmt(Number(donor.received) || 0)} received</div>
                        </div>
                    ))}
                    {donors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No donors recorded.</p>}
                </div>
                <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>Budget Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Expenses</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text)' }}>{fmt(totalExpenses)}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{expensePct}% of budget</div>
                        </div>
                        <DonutChart pct={expensePct} />
                    </div>
                </div>
            </div>
        </div>
    );
}
