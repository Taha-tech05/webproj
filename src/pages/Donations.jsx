import { useState } from 'react';
import { useStore } from '../store.js';
import { useAuth } from '../AuthContext.jsx';
import {
  Modal, Field, Input, Select, Btn, Badge, Table, TR, TD,
  PageHeader, SearchBar, StatCard, Toast, ConfirmDialog, fmt, fmtDate
} from '../components/UI.jsx';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const PAYMENT_MODES = ['Cash', 'Bank Transfer', 'Check', 'Online Transfer'];

const emptyForm = { date: '', donorId: '', projectId: '', month: '', paymentMode: '', amount: '', status: 'pending', notes: '' };

function validate(form) {
  const errs = {};
  if (!form.date) errs.date = 'Date is required';
  if (!form.donorId) errs.donorId = 'Donor is required';
  if (!form.projectId) errs.projectId = 'Project is required';
  if (!form.month) errs.month = 'Month is required';
  if (!form.paymentMode) errs.paymentMode = 'Payment mode is required';
  if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Valid amount is required (must be > 0)';
  if (!form.status) errs.status = 'Status is required';
  return errs;
}

export default function Donations() {
  const { user } = useAuth();
  const { donations, donors, projects, addDonation, updateDonation, deleteDonation } = useStore();
  const isAdmin = user?.role === 'Admin';

  const [search, setSearch] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setEditTarget(d);
    setForm({ date: d.date, donorId: d.donorId, projectId: d.projectId, month: d.month, paymentMode: d.paymentMode, amount: d.amount, status: d.status, notes: d.notes || '' });
    setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (editTarget) {
      updateDonation(editTarget.id, { ...form, amount: Number(form.amount) }, user);
      showToast('Donation updated successfully');
    } else {
      addDonation(form, user);
      showToast('Donation recorded successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => { deleteDonation(id); showToast('Donation deleted', 'error'); };

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  // Filtered
  const filtered = donations.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.donor?.toLowerCase().includes(q) || d.project?.toLowerCase().includes(q);
    const matchProject = !filterProject || d.project === filterProject;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchProject && matchStatus;
  });

  const totalAll = donations.reduce((s, d) => s + d.amount, 0);
  const totalPaid = donations.filter(d => d.status === 'paid').reduce((s, d) => s + d.amount, 0);
  const totalPending = donations.filter(d => d.status === 'pending').reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <PageHeader
        title="Donations"
        subtitle={isAdmin ? 'Manage all donation records' : 'Record and manage donation entries'}
        actions={
          <>
            {isAdmin && (
              <Btn variant="ghost" onClick={() => {
                const csv = ['Date,Donor,Project,Month,Payment Mode,Amount,Status',
                  ...filtered.map(d => `${d.date},${d.donor},${d.project},${d.month},${d.paymentMode},${d.amount},${d.status}`)
                ].join('\n');
                const a = document.createElement('a');
                a.href = 'data:text/csv,' + encodeURIComponent(csv);
                a.download = 'donations.csv'; a.click();
                showToast('Exported to CSV');
              }}>↓ Export CSV</Btn>
            )}
            <Btn variant="primary" onClick={openAdd}>+ Record Donation</Btn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Donations" value={fmt(totalAll)} icon="💰" />
        <StatCard label="Paid" value={fmt(totalPaid)} subColor="var(--accent)" sub={`${donations.filter(d=>d.status==='paid').length} records`} icon="✅" />
        <StatCard label="Pending" value={fmt(totalPending)} subColor="var(--warning)" sub={`${donations.filter(d=>d.status==='pending').length} records`} icon="⏳" />
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Filters */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by donor or project..." />
          <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', minWidth: '160px', fontFamily: 'var(--font)', cursor: 'pointer' }}>
            <option value="">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Showing {filtered.length} of {donations.length}
          </span>
        </div>

        <Table
          headers={['Date', 'Donor', 'Project', 'Month', 'Payment Mode', { label: 'Amount', align: 'right' }, 'Status', { label: 'Actions', align: 'center' }]}
          empty={filtered.length === 0}
        >
          {filtered.map(d => (
            <TR key={d.id}>
              <TD mono muted>{d.date}</TD>
              <TD bold>{d.donor}</TD>
              <TD muted>{d.project}</TD>
              <TD muted>{d.month}</TD>
              <TD muted>{d.paymentMode}</TD>
              <TD align="right" mono bold>{fmt(d.amount)}</TD>
              <TD><Badge status={d.status} /></TD>
              <TD align="center">
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <Btn size="sm" variant="secondary" onClick={() => openEdit(d)}>✏ Edit</Btn>
                  {isAdmin && (
                    <Btn size="sm" variant="danger" onClick={() => setConfirmId(d.id)}>🗑</Btn>
                  )}
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Donation' : 'Record Donation'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Date" required error={errors.date}>
            <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} error={errors.date} />
          </Field>
          <Field label="Month" required error={errors.month}>
            <Select value={form.month} onChange={e => set('month', e.target.value)} error={errors.month}>
              <option value="">Select month</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Donor" required error={errors.donorId}>
          <Select value={form.donorId} onChange={e => set('donorId', e.target.value)} error={errors.donorId}>
            <option value="">Select donor</option>
            {donors.filter(d => d.status === 'active').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </Field>
        <Field label="Project" required error={errors.projectId}>
          <Select value={form.projectId} onChange={e => set('projectId', e.target.value)} error={errors.projectId}>
            <option value="">Select project</option>
            {projects.filter(p => p.status === 'active').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Field label="Amount (Rs)" required error={errors.amount}>
            <Input type="number" min="1" placeholder="e.g. 50000" value={form.amount} onChange={e => set('amount', e.target.value)} error={errors.amount} />
          </Field>
          <Field label="Payment Mode" required error={errors.paymentMode}>
            <Select value={form.paymentMode} onChange={e => set('paymentMode', e.target.value)} error={errors.paymentMode}>
              <option value="">Select mode</option>
              {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Status" required error={errors.status}>
          <Select value={form.status} onChange={e => set('status', e.target.value)} error={errors.status}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </Select>
        </Field>
        <Field label="Notes (optional)">
          <Input placeholder="Any additional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </Field>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <Btn variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>Cancel</Btn>
          <Btn variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit}>
            {editTarget ? '✓ Update Donation' : '+ Record Donation'}
          </Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={() => handleDelete(confirmId)}
        title="Delete Donation?" message="This action cannot be undone. The donation record will be permanently removed." />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
