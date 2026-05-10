import { useState } from 'react';
import { useStore } from '../../store.js';
import { useAuth } from '../../AuthContext.jsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  PageHeader, StatCard, Btn, fmt, toMoneyNumber
} from '../../components/UI.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const COLORS = ['#1a3faa', '#00c48c', '#f5a623', '#f0384a', '#7b2d8b', '#0d6e6e'];

export default function Reports() {
  const { donors, projects, donations, expenses } = useStore();
  const [activeTab, setActiveTab] = useState('summary');
  const [filterDonor, setFilterDonor] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const totalReceived = donations.filter(d => d.status === 'paid').reduce((s, d) => s + toMoneyNumber(d.amount), 0);
  const totalPending = donations.filter(d => d.status === 'pending').reduce((s, d) => s + toMoneyNumber(d.amount), 0);
  const totalExpenses = expenses.reduce((s, e) => s + toMoneyNumber(e.amount), 0);
  const balance = totalReceived - totalExpenses;

  // Monthly donations data
  const monthlyDonations = MONTHS.map(m => ({
    month: m.slice(0, 3),
    donations: donations.filter(d => d.month === m && d.status === 'paid').reduce((s, d) => s + toMoneyNumber(d.amount), 0),
    pending: donations.filter(d => d.month === m && d.status === 'pending').reduce((s, d) => s + toMoneyNumber(d.amount), 0),
    expenses: expenses.filter(e => {
      const date = new Date(e.date);
      return date.toLocaleString('default', { month: 'long' }) === m;
    }).reduce((s, e) => s + toMoneyNumber(e.amount), 0),
  })).filter(m => m.donations > 0 || m.expenses > 0);

  // Project financial summary
  const projectSummary = projects.map(p => ({
    name: p.name,
    income: toMoneyNumber(p.income),
    expenses: toMoneyNumber(p.expenses),
    balance: toMoneyNumber(p.income) - toMoneyNumber(p.expenses),
    budget: toMoneyNumber(p.budget),
  }));

  // Donor report
  const donorReport = donors.map(d => {
    const dDonations = donations.filter(dn => dn.donorId === d.id);
    const paid = dDonations.filter(dn => dn.status === 'paid').reduce((s, dn) => s + toMoneyNumber(dn.amount), 0);
    const pending = dDonations.filter(dn => dn.status === 'pending').reduce((s, dn) => s + toMoneyNumber(dn.amount), 0);
    return { ...d, paid, pending, total: dDonations.reduce((s, dn) => s + toMoneyNumber(dn.amount), 0), count: dDonations.length };
  }).filter(d => !filterDonor || d.name === filterDonor);

  // Filtered donations
  const filteredDonations = donations.filter(d => {
    return (!filterProject || d.project === filterProject) && (!filterMonth || d.month === filterMonth);
  });

  // Pie data for projects
  const pieData = projects
    .map((p, i) => ({ name: p.name, value: toMoneyNumber(p.income), color: COLORS[i % COLORS.length] }))
    .filter(p => p.value > 0);

  const tabs = [
    { id: 'summary', label: '📈 Summary' },
    { id: 'donor', label: '👥 Donor Report' },
    { id: 'project', label: '📁 Project Report' },
    { id: 'monthly', label: '📅 Monthly Report' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Financial summaries and analysis</p>
        </div>
        <button onClick={() => window.print()} style={{ padding: '9px 18px', border: '1.5px solid var(--border)', borderRadius: '9px', background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
          🖨 Print Report
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f4f6fb', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '8px 18px', borderRadius: '9px', border: 'none', fontSize: '13.5px',
            fontWeight: activeTab === t.id ? '700' : '500', cursor: 'pointer', fontFamily: 'var(--font)',
            background: activeTab === t.id ? '#fff' : 'transparent',
            color: activeTab === t.id ? 'var(--text)' : 'var(--text-muted)',
            boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="animate-fade">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="Total Received" value={fmt(totalReceived)} sub="Paid donations" icon="💰" />
            <StatCard label="Pending" value={fmt(totalPending)} subColor="var(--warning)" sub="Awaiting payment" icon="⏳" />
            <StatCard label="Total Expenses" value={fmt(totalExpenses)} subColor="var(--danger)" sub="All projects" icon="📊" />
            <StatCard label="Net Balance" value={fmt(balance)} subColor={balance >= 0 ? 'var(--accent)' : 'var(--danger)'} sub={balance >= 0 ? 'Surplus' : 'Deficit'} icon="⚖️" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Income by Project</h3>
              {pieData.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No project income available</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Monthly Donations vs Expenses</h3>
              {monthlyDonations.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyDonations} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7a8bbf' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#7a8bbf' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Bar dataKey="donations" fill="#1a3faa" radius={[3, 3, 0, 0]} name="Donations" />
                    <Bar dataKey="expenses" fill="#f0384a" radius={[3, 3, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Donor Report Tab */}
      {activeTab === 'donor' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <select value={filterDonor} onChange={e => setFilterDonor(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
              <option value="">All Donors</option>
              {donors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafbfe' }}>
                  {['Donor Name', 'Status', 'Pledged', 'Paid', 'Pending', 'Entries', 'Completion'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: ['Pledged', 'Paid', 'Pending'].includes(h) ? 'right' : 'left', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donorReport.map(d => {
                  const pct = d.pledged > 0 ? Math.round((d.paid / d.pledged) * 100) : 0;
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '13px 14px', fontWeight: '700' }}>{d.name}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: d.status === 'active' ? '#e8faf4' : '#f5f5f5', color: d.status === 'active' ? '#00875a' : '#888' }}>{d.status}</span>
                      </td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)' }}>{fmt(d.pledged)}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: '700' }}>{fmt(d.paid)}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)', color: d.pending > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>{fmt(d.pending)}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'center', color: 'var(--text-muted)' }}>{d.count}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', background: '#e8eeff', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? 'var(--accent)' : 'var(--primary)', borderRadius: '99px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '700', minWidth: '36px' }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Report Tab */}
      {activeTab === 'project' && (
        <div className="animate-fade">
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafbfe' }}>
                  {['Project', 'Budget', 'Income', 'Expenses', 'Balance', 'Budget Used', 'Health'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: ['Budget', 'Income', 'Expenses', 'Balance'].includes(h) ? 'right' : 'left', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectSummary.map((p, i) => {
                  const budgetPct = p.budget > 0 ? Math.min(Math.round((p.income / p.budget) * 100), 100) : 0;
                  const expPct = p.income > 0 ? Math.round((p.expenses / p.income) * 100) : 0;
                  const health = expPct > 85 ? '🔴 Critical' : expPct > 65 ? '🟡 Caution' : '🟢 Healthy';
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '13px 14px', fontWeight: '700' }}>{p.name}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--text-muted)' }}>{fmt(p.budget)}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: '700' }}>{fmt(p.income)}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--danger)' }}>{fmt(p.expenses)}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: '800', color: p.balance >= 0 ? 'var(--text)' : 'var(--danger)' }}>{fmt(p.balance)}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', background: '#e8eeff', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${budgetPct}%`, background: COLORS[i % COLORS.length], borderRadius: '99px' }} />
                          </div>
                          <span style={{ fontSize: '12px', minWidth: '36px' }}>{budgetPct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: '13px', fontWeight: '600' }}>{health}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Report Tab */}
      {activeTab === 'monthly' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
              <option value="">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
              <option value="">All Months</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafbfe' }}>
                  {['Date', 'Donor', 'Project', 'Month', 'Payment Mode', 'Amount', 'Status'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: h === 'Amount' ? 'right' : 'left', fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-muted)' }}>{d.date}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '600' }}>{d.donor}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '13px' }}>{d.project}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '13px' }}>{d.month}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '13px' }}>{d.paymentMode}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: '700', fontSize: '14px' }}>{fmt(d.amount)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', background: d.status === 'paid' ? '#e8faf4' : '#fff8e6', color: d.status === 'paid' ? '#00875a' : '#b07d00' }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
                {filteredDonations.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No records match your filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '16px 20px', marginTop: '16px', display: 'flex', gap: '32px' }}>
            <div><span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total: </span><strong style={{ fontFamily: 'var(--mono)' }}>{fmt(filteredDonations.reduce((s, d) => s + toMoneyNumber(d.amount), 0))}</strong></div>
            <div><span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Paid: </span><strong style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>{fmt(filteredDonations.filter(d => d.status === 'paid').reduce((s, d) => s + toMoneyNumber(d.amount), 0))}</strong></div>
            <div><span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pending: </span><strong style={{ fontFamily: 'var(--mono)', color: 'var(--warning)' }}>{fmt(filteredDonations.filter(d => d.status === 'pending').reduce((s, d) => s + toMoneyNumber(d.amount), 0))}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
