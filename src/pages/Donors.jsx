import { useState } from 'react';
import { useStore } from '../store.js';
import { useAuth } from '../AuthContext.jsx';
import {
  Modal, Field, Input, Select, Btn, Badge, Table, TR, TD,
  PageHeader, SearchBar, StatCard, Toast, ConfirmDialog, fmt
} from '../components/UI.jsx';

const emptyForm = { name: '', email: '', phone: '', status: 'active', pledged: '' };

function validate(form) {
  const errs = {};
  if (!form.name?.trim()) errs.name = 'Full name is required';
  if (!form.email?.trim()) errs.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
  if (!form.phone?.trim()) errs.phone = 'Phone number is required';
  else if (!/^\+?[\d\s-]{10,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
  if (form.pledged && (isNaN(form.pledged) || Number(form.pledged) < 0)) errs.pledged = 'Pledged amount must be a positive number';
  return errs;
}

export default function Donors() {
  const { user } = useAuth();
  const { donors, addDonor, updateDonor, deleteDonor, donations } = useStore();
  const isAdmin = user?.role === 'Admin';

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3500); };

  const openAdd = () => { setEditTarget(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit = (d) => {
    setEditTarget(d);
    setForm({ name: d.name, email: d.email, phone: d.phone, status: d.status, pledged: d.pledged || '' });
    setErrors({}); setModalOpen(true);
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (editTarget) {
      updateDonor(editTarget.id, { ...form, pledged: Number(form.pledged) || editTarget.pledged });
      showToast('Donor updated successfully');
    } else {
      addDonor({ ...form, pledged: Number(form.pledged) || 0 });
      showToast('Donor added successfully');
    }
    setModalOpen(false);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })); };

  const filtered = donors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name?.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeDonors = donors.filter(d => d.status === 'active').length;
  const totalPledged = donors.reduce((s, d) => s + (d.pledged || 0), 0);
  const totalReceived = donors.reduce((s, d) => s + (d.received || 0), 0);

  // Get donation history for a donor
  const getDonorDonations = (donorId) => donations.filter(d => d.donorId === donorId);

  return (
    <div>
      <PageHeader
        title="Donors"
        subtitle={isAdmin ? 'Manage all donor records' : 'View donor information'}
        actions={
          <>
            {isAdmin && (
              <>
                <Btn variant="ghost" onClick={() => {
                  const csv = ['Name,Email,Phone,Status,Pledged,Received', ...filtered.map(d => `${d.name},${d.email},${d.phone},${d.status},${d.pledged},${d.received}`)].join('\n');
                  const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = 'donors.csv'; a.click();
                  showToast('Exported to CSV');
                }}>↓ Export</Btn>
                <Btn variant="primary" onClick={openAdd}>+ Add Donor</Btn>
              </>
            )}
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Donors" value={donors.length} icon="👥" />
        <StatCard label="Active Donors" value={activeDonors} sub="Currently active" icon="✅" />
        <StatCard label="Total Pledged" value={fmt(totalPledged)} icon="📌" />
        <StatCard label="Total Received" value={fmt(totalReceived)} sub="Collected so far" icon="💰" />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Showing {filtered.length} of {donors.length}</span>
        </div>

        <Table
          headers={['Donor Name', 'Email', 'Phone', 'Status', { label: 'Total Pledged', align: 'right' }, { label: 'Total Received', align: 'right' }, { label: 'Actions', align: 'center' }]}
          empty={filtered.length === 0}
        >
          {filtered.map(d => (
            <TR key={d.id}>
              <TD>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3faa, #2952d9)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>{d.name?.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{d.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Joined {d.joined}</div>
                  </div>
                </div>
              </TD>
              <TD muted>{d.email}</TD>
              <TD muted mono>{d.phone}</TD>
              <TD><Badge status={d.status} /></TD>
              <TD align="right" mono bold>{fmt(d.pledged || 0)}</TD>
              <TD align="right" mono>{fmt(d.received || 0)}</TD>
              <TD align="center">
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <Btn size="sm" variant="ghost" onClick={() => setDetailTarget(d)}>👁 View</Btn>
                  {isAdmin && (
                    <>
                      <Btn size="sm" variant="secondary" onClick={() => openEdit(d)}>✏</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setConfirmId(d.id)}>🗑</Btn>
                    </>
                  )}
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </div>

      {/* Add/Edit Modal */}
      {isAdmin && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Donor' : 'Add New Donor'}>
          <Field label="Full Name" required error={errors.name}>
            <Input placeholder="e.g. Ahmed Khan" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="Email Address" required error={errors.email}>
              <Input type="email" placeholder="donor@email.com" value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <Input placeholder="+92 300 1234567" value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="Pledged Amount (Rs)" error={errors.pledged}>
              <Input type="number" min="0" placeholder="e.g. 200000" value={form.pledged} onChange={e => set('pledged', e.target.value)} error={errors.pledged} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Btn variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>Cancel</Btn>
            <Btn variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit}>
              {editTarget ? '✓ Update Donor' : '+ Add Donor'}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Detail View Modal */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title="Donor Details" width="600px">
        {detailTarget && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: '#f0f4ff', borderRadius: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a3faa, #2952d9)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '22px' }}>{detailTarget.name?.charAt(0)}</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800' }}>{detailTarget.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{detailTarget.email} · {detailTarget.phone}</div>
                <div style={{ marginTop: '6px' }}><Badge status={detailTarget.status} /></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {[['Pledged', fmt(detailTarget.pledged || 0), '#f0f4ff', 'var(--primary)'], ['Received', fmt(detailTarget.received || 0), '#e8faf4', 'var(--accent)'], ['Balance', fmt((detailTarget.pledged || 0) - (detailTarget.received || 0)), '#fff8e6', 'var(--warning)']].map(([l, v, bg, color]) => (
                <div key={l} style={{ background: bg, borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{l}</div>
                  <div style={{ fontWeight: '800', fontSize: '16px', color, fontFamily: 'var(--mono)' }}>{v}</div>
                </div>
              ))}
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Donation History</h4>
            {getDonorDonations(detailTarget.id).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No donations recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {getDonorDonations(detailTarget.id).map(d => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fafbfe', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{d.project} — {d.month}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.date} · {d.paymentMode}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontFamily: 'var(--mono)', fontSize: '14px' }}>{fmt(d.amount)}</div>
                      <Badge status={d.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={() => { deleteDonor(confirmId); showToast('Donor deleted', 'error'); }}
        title="Delete Donor?" message="This will permanently remove this donor and all their data." />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
