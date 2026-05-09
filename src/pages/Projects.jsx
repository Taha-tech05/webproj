import { useState } from 'react';
import { useStore } from '../store.js';
import { useAuth } from '../AuthContext.jsx';
import {
  Modal, Field, Input, Select, Textarea, Btn, Badge, Table, TR, TD,
  PageHeader, SearchBar, StatCard, Toast, ConfirmDialog, fmt
} from '../components/UI.jsx';

const emptyForm = { name: '', description: '', budget: '', status: 'active' };

function validate(form) {
  const errs = {};
  if (!form.name?.trim()) errs.name = 'Project name is required';
  if (!form.description?.trim()) errs.description = 'Description is required';
  if (!form.budget || isNaN(form.budget) || Number(form.budget) <= 0) errs.budget = 'Valid budget amount is required';
  return errs;
}

export default function Projects() {
  const { user } = useAuth();
  const { projects, addProject, updateProject, deleteProject, donations, expenses } = useStore();
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
  const openEdit = (p) => { setEditTarget(p); setForm({ name: p.name, description: p.description, budget: p.budget, status: p.status }); setErrors({}); setModalOpen(true); };
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })); };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (editTarget) { updateProject(editTarget.id, { ...form, budget: Number(form.budget) }); showToast('Project updated'); }
    else { addProject({ ...form, budget: Number(form.budget) }); showToast('Project created'); }
    setModalOpen(false);
  };

  const filtered = projects.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const totalIncome = projects.reduce((s, p) => s + (p.income || 0), 0);
  const totalExpenses = projects.reduce((s, p) => s + (p.expenses || 0), 0);

  const getProjectDonations = (pId) => donations.filter(d => d.projectId === pId);
  const getProjectExpenses = (pId) => expenses.filter(e => e.projectId === pId);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={isAdmin ? 'Manage all projects and track financials' : 'View project information and balances'}
        actions={
          <>
            {isAdmin && <Btn variant="primary" onClick={openAdd}>+ Add Project</Btn>}
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Projects" value={projects.length} icon="📁" />
        <StatCard label="Total Budget" value={fmt(totalBudget)} icon="🎯" />
        <StatCard label="Total Income" value={fmt(totalIncome)} icon="💰" />
        <StatCard label="Total Expenses" value={fmt(totalExpenses)} subColor="var(--danger)" icon="📊" />
      </div>

      {/* Project Cards View */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: '9px', fontSize: '13.5px', background: '#fafbfe', fontFamily: 'var(--font)', cursor: 'pointer' }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map(p => {
            const balance = (p.income || 0) - (p.expenses || 0);
            const budgetPct = Math.min(Math.round(((p.income || 0) / p.budget) * 100), 100);
            const expPct = p.income > 0 ? Math.round(((p.expenses || 0) / p.income) * 100) : 0;
            const isLow = balance < 50000 || expPct > 85;
            const colorMap = { Education: '#1a3faa', Health: '#00875a', Infrastructure: '#b07d00', Community: '#7b2d8b', Environment: '#0d6e6e' };
            const pColor = colorMap[p.name] || 'var(--primary)';

            return (
              <div key={p.id} style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <div style={{ height: '6px', background: `linear-gradient(90deg, ${pColor}, ${pColor}88)` }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>{p.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.description}</p>
                    </div>
                    <Badge status={p.status} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    {[['Budget', fmt(p.budget), '#f0f4ff', pColor], ['Income', fmt(p.income || 0), '#e8faf4', '#00875a'], ['Expenses', fmt(p.expenses || 0), '#fff8e6', '#b07d00'], ['Balance', fmt(balance), isLow ? '#fff0f1' : '#e8faf4', isLow ? 'var(--danger)' : '#00875a']].map(([l, v, bg, c]) => (
                      <div key={l} style={{ background: bg, borderRadius: '8px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>{l}</div>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: c, fontFamily: 'var(--mono)' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>
                      <span>Budget utilization</span><span>{budgetPct}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#e8eeff', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${budgetPct}%`, background: pColor, borderRadius: '99px' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Btn size="sm" variant="ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDetailTarget(p)}>👁 Details</Btn>
                    {isAdmin && (
                      <>
                        <Btn size="sm" variant="secondary" onClick={() => openEdit(p)}>✏ Edit</Btn>
                        <Btn size="sm" variant="danger" onClick={() => setConfirmId(p.id)}>🗑</Btn>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAdmin && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Project' : 'Add New Project'}>
          <Field label="Project Name" required error={errors.name}>
            <Input placeholder="e.g. Education Fund" value={form.name} onChange={e => set('name', e.target.value)} error={errors.name} />
          </Field>
          <Field label="Description" required error={errors.description}>
            <Textarea placeholder="Brief description of the project goals..." value={form.description} onChange={e => set('description', e.target.value)} error={errors.description} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Field label="Budget (Rs)" required error={errors.budget}>
              <Input type="number" min="1" placeholder="e.g. 500000" value={form.budget} onChange={e => set('budget', e.target.value)} error={errors.budget} />
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
            <Btn variant="primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit}>{editTarget ? '✓ Update Project' : '+ Add Project'}</Btn>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title="Project Details" width="640px">
        {detailTarget && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>{detailTarget.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{detailTarget.description}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {[['Budget', fmt(detailTarget.budget)], ['Income', fmt(detailTarget.income || 0)], ['Expenses', fmt(detailTarget.expenses || 0)], ['Balance', fmt((detailTarget.income || 0) - (detailTarget.expenses || 0))]].map(([l, v]) => (
                <div key={l} style={{ background: '#fafbfe', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{l}</div>
                  <div style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'var(--mono)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>Recent Donations ({getProjectDonations(detailTarget.id).length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {getProjectDonations(detailTarget.id).slice(0, 8).map(d => (
                    <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fafbfe', borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border)' }}>
                      <span>{d.donor} · {d.month}</span>
                      <span style={{ fontWeight: '700', fontFamily: 'var(--mono)' }}>{fmt(d.amount)}</span>
                    </div>
                  ))}
                  {getProjectDonations(detailTarget.id).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>None recorded</p>}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px' }}>Recent Expenses ({getProjectExpenses(detailTarget.id).length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                  {getProjectExpenses(detailTarget.id).slice(0, 8).map(e => (
                    <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#fafbfe', borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border)' }}>
                      <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</span>
                      <span style={{ fontWeight: '700', fontFamily: 'var(--mono)' }}>{fmt(e.amount)}</span>
                    </div>
                  ))}
                  {getProjectExpenses(detailTarget.id).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>None recorded</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={() => { deleteProject(confirmId); showToast('Project deleted', 'error'); }}
        title="Delete Project?" message="This will permanently remove the project. Donations and expenses linked to it will remain." />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
