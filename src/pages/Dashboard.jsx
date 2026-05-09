import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { mockDonors, mockProjects, mockDonations, monthlyData } from '../data.js';

const fmt = (n) => `Rs${n.toLocaleString('en-PK')}`;

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

export default function Dashboard({ onNavigate }) {
    const { user } = useAuth();
    const router = useRouter();

    // Admin-only guard
    useEffect(() => {
        if (user && user.role !== 'Admin') {
            router.replace('/operator-dashboard');
        }
    }, [user]);

    if (!user || user.role !== 'Admin') return null;

    const totalPledged = mockDonors.reduce((s, d) => s + d.pledged, 0);
    const totalReceived = mockDonors.reduce((s, d) => s + d.received, 0);
    const totalExpenses = mockProjects.reduce((s, p) => s + p.expenses, 0);
    const totalBudget = mockProjects.reduce((s, p) => s + p.budget, 0);
    const fundingPct = Math.round((totalReceived / totalPledged) * 100);
    const expensePct = Math.round((totalExpenses / totalBudget) * 100);

    return (
        <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)', marginBottom: '32px', letterSpacing: '-0.5px' }}>
                Dashboard
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatCard label="Total Pledged" value={fmt(totalPledged)} icon="💰" />
                <StatCard label="Total Received" value={fmt(totalReceived)} sub={`${fundingPct}% of pledged`} icon="✓" />
                <StatCard label="Active Projects" value={mockProjects.filter(p => p.status === 'active').length} icon="📁" />
                <StatCard label="Total Expenses" value={fmt(totalExpenses)} icon="📊" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>Monthly Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="month" stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)' }} />
                            <Line type="monotone" dataKey="donations" stroke="var(--primary)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: 'var(--text)' }}>Project Funding</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={mockProjects}>
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
                    {mockDonors.slice(0, 3).map(donor => (
                        <div key={donor.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{donor.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{fmt(donor.received)} received</div>
                        </div>
                    ))}
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
