import { useState } from 'react';

const mockExpenses = [
    {
        id: 1,
        date: '2024-01-18',
        project: 'Education',
        description: 'Textbooks and learning materials',
        paymentMode: 'Bank Transfer',
        amount: 25000,
    },
    {
        id: 2,
        date: '2024-01-15',
        project: 'Health',
        description: 'Medical supplies and equipment',
        paymentMode: 'Cash',
        amount: 45000,
    },
    {
        id: 3,
        date: '2024-01-10',
        project: 'Infrastructure',
        description: 'Cement and labor costs',
        paymentMode: 'Check',
        amount: 120000,
    },
    {
        id: 4,
        date: '2024-01-08',
        project: 'Community',
        description: 'Event organization expenses',
        paymentMode: 'Cash',
        amount: 15000,
    },
    {
        id: 5,
        date: '2024-01-05',
        project: 'Education',
        description: 'Staff salaries and allowances',
        paymentMode: 'Bank Transfer',
        amount: 85000,
    },
    {
        id: 6,
        date: '2024-01-02',
        project: 'Health',
        description: 'Equipment maintenance',
        paymentMode: 'Check',
        amount: 35000,
    },
];

const fmt = (n) => `Rs${n.toLocaleString('en-PK')}`;

export default function Expenses() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProject, setFilterProject] = useState('All Projects');
    const [expenses, setExpenses] = useState(mockExpenses);

    const projects = ['All Projects', 'Education', 'Health', 'Infrastructure', 'Community'];
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.project.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProject = filterProject === 'All Projects' || expense.project === filterProject;
        return matchesSearch && matchesProject;
    });

    return (
        <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px' }}>
                    Expenses
                </h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        style={{
                            padding: '10px 16px',
                            background: '#fff',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        ↓ Export
                    </button>
                    <button
                        style={{
                            padding: '10px 16px',
                            background: 'var(--primary)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        + Record Expense
                    </button>
                </div>
            </div>

            <div style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                padding: '24px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '24px',
            }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Total Expenses</div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#ff6b6b', letterSpacing: '-0.5px' }}>
                    {fmt(totalExpenses)}
                </div>
            </div>

            <div style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                padding: '24px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input
                            type="text"
                            placeholder="Search by description or project..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 16px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                background: '#fff',
                            }}
                        />
                    </div>
                    <select
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: '#fff',
                            cursor: 'pointer',
                            minWidth: '150px',
                        }}
                    >
                        {projects.map(proj => (
                            <option key={proj} value={proj}>{proj}</option>
                        ))}
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '14px',
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Project</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Description</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Payment Mode</th>
                                <th style={{ padding: '12px 0', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length > 0 ? (
                                filteredExpenses.map((expense) => (
                                    <tr key={expense.id} style={{
                                        borderBottom: '1px solid var(--border)',
                                        height: '56px',
                                    }}>
                                        <td style={{ padding: '12px 0', color: 'var(--text-muted)', fontWeight: '500' }}>
                                            {expense.date}
                                        </td>
                                        <td style={{ padding: '12px 0', fontWeight: '600', color: 'var(--text)' }}>
                                            {expense.project}
                                        </td>
                                        <td style={{ padding: '12px 0', color: 'var(--text-muted)' }}>
                                            {expense.description}
                                        </td>
                                        <td style={{ padding: '12px 0', color: 'var(--text-muted)' }}>
                                            {expense.paymentMode}
                                        </td>
                                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '600', color: '#ff6b6b' }}>
                                            {fmt(expense.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '32px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No expenses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
