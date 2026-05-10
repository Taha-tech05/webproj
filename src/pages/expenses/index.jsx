import { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';
import { useStore } from '../../store.js';
import {
    Modal, Field, Input, Select, Btn, Badge, Table, TR, TD,
    PageHeader, SearchBar, StatCard, Toast, ConfirmDialog, fmt
} from '../../components/UI.jsx';

const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Check', 'Online Transfer'];
const emptyForm = {
    date: '',
    projectId: '',
    description: '',
    paymentMode: '',
    amount: '',
};

function validate(form) {
    const errors = {};
    if (!form.date) errors.date = 'Date is required';
    if (!form.projectId) errors.projectId = 'Project is required';
    if (!form.description?.trim()) errors.description = 'Description is required';
    if (!form.paymentMode) errors.paymentMode = 'Payment mode is required';
    if (!form.amount || Number.isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
        errors.amount = 'Valid amount is required';
    }
    return errors;
}

export default function Expenses() {
    const { user } = useAuth();
    const { expenses, projects, addExpense, deleteExpense } = useStore();
    const isAdmin = user?.role === 'Admin';

    const [search, setSearch] = useState('');
    const [filterProject, setFilterProject] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const openAdd = () => {
        setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
        setErrors({});
        setModalOpen(true);
    };

    const set = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
    };

    const handleSubmit = async () => {
        const nextErrors = validate(form);
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        const result = await addExpense({ ...form, amount: Number(form.amount) });
        if (result?.success === false) {
            showToast(result.error, 'error');
            return;
        }

        showToast('Expense recorded successfully');
        setModalOpen(false);
    };

    const filteredExpenses = expenses.filter(expense => {
        const q = search.toLowerCase();
        const matchesSearch = !q ||
            expense.description?.toLowerCase().includes(q) ||
            expense.project?.toLowerCase().includes(q) ||
            expense.paymentMode?.toLowerCase().includes(q);
        const matchesProject = !filterProject || expense.project === filterProject;
        return matchesSearch && matchesProject;
    });

    const totalExpenses = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthTotal = expenses
        .filter(expense => {
            const date = new Date(expense.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);

    return (
        <div>
            <PageHeader
                title="Expenses"
                subtitle={isAdmin ? 'Manage and review project spending' : 'Record project expenses'}
                actions={
                    <>
                        <Btn variant="ghost" onClick={() => {
                            const csv = ['Date,Project,Description,Payment Mode,Amount',
                                ...filteredExpenses.map(e => `${e.date},${e.project},${e.description},${e.paymentMode},${e.amount}`)
                            ].join('\n');
                            const a = document.createElement('a');
                            a.href = 'data:text/csv,' + encodeURIComponent(csv);
                            a.download = 'expenses.csv';
                            a.click();
                            showToast('Exported to CSV');
                        }}>Export</Btn>
                        <Btn variant="primary" onClick={openAdd}>+ Record Expense</Btn>
                    </>
                }
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <StatCard label="Total Expenses" value={fmt(totalExpenses)} sub="All records" subColor="var(--danger)" icon="$" />
                <StatCard label="This Month" value={fmt(monthTotal)} sub="Current month spending" subColor="var(--warning)" icon="30d" />
                <StatCard label="Expense Entries" value={expenses.length} sub="Recorded transactions" icon="#" />
            </div>

            <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by description, project, or payment mode..." />
                    <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
                        <option value="">A Projects</option>
                        {projects.map(project => <option key={project.id} value={project.name}>{project.name}</option>)}
                    </select>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Showing {filteredExpenses.length} of {expenses.length}</span>
                </div>

                <Table
                    headers={['Date', 'Project', 'Description', 'Payment Mode', 'Entered By', { label: 'Amount', align: 'right' }, { label: 'Actions', align: 'center' }]}
                    empty={filteredExpenses.length === 0}
                >
                    {filteredExpenses.map(expense => (
                        <TR key={expense.id}>
                            <TD mono muted>{expense.date}</TD>
                            <TD bold>{expense.project || 'Unassigned'}</TD>
                            <TD muted>{expense.description}</TD>
                            <TD><Badge status={expense.paymentMode || 'pending'} /></TD>
                            <TD muted>{expense.enteredBy || 'Unknown'}</TD>
                            <TD align="right" mono bold>{fmt(expense.amount)}</TD>
                            <TD align="center">
                                {isAdmin ? (
                                    <Btn size="sm" variant="danger" onClick={() => setConfirmId(expense.id)}>Delete</Btn>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Recorded</span>
                                )}
                            </TD>
                        </TR>
                    ))}
                </Table>
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Expense">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <Field label="Date" required error={errors.date}>
                        <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} error={errors.date} />
                    </Field>
                    <Field label="Amount (Rs)" required error={errors.amount}>
                        <Input type="number" min="1" placeholder="e.g. 25000" value={form.amount} onChange={e => set('amount', e.target.value)} error={errors.amount} />
                    </Field>
                </div>
                <Field label="Project" required error={errors.projectId}>
                    <Select value={form.projectId} onChange={e => set('projectId', e.target.value)} error={errors.projectId}>
                        <option value="">Select project</option>
                        {projects.filter(p => p.status === 'active').map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </Select>
                </Field>
                <Field label="Payment Mode" required error={errors.paymentMode}>
                    <Select value={form.paymentMode} onChange={e => set('paymentMode', e.target.value)} error={errors.paymentMode}>
                        <option value="">Select payment mode</option>
                        {PAYMENT_MODES.map(mode => <option key={mode}>{mode}</option>)}
                    </Select>
                </Field>
                <Field label="Description" required error={errors.description}>
                    <Input placeholder="e.g. Office supplies for education project" value={form.description} onChange={e => set('description', e.target.value)} error={errors.description} />
                </Field>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <Btn variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>Cancel</Btn>
                    <Btn variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit}>Record Expense</Btn>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!confirmId}
                onClose={() => setConfirmId(null)}
                onConfirm={() => {
                    deleteExpense(confirmId);
                    setConfirmId(null);
                    showToast('Expense deleted', 'error');
                }}
                title="Delete Expense?"
                message="This will permanently remove this expense record."
            />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
