import { useState } from 'react';

export const toMoneyNumber = (n) => {
  const value = Number(n);
  return Number.isFinite(value) ? value : 0;
};

export const fmt = (n) => `Rs${toMoneyNumber(n).toLocaleString('en-PK')}`;
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-PK') : '';

export function Modal({ open, onClose, title, children, width }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', width: width || 520, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
      {children}
      {error && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 5 }}>{error}</div>}
    </div>
  );
}

export function Input({ type, value, onChange, placeholder, min, error }) {
  return <input type={type || 'text'} value={value} onChange={onChange} placeholder={placeholder} min={min} style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 9, fontSize: 14, fontFamily: 'var(--font)', background: '#f8fafc', boxSizing: 'border-box', outline: 'none' }} />;
}

export function Select({ value, onChange, error, children }) {
  return <select value={value} onChange={onChange} style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 9, fontSize: 14, fontFamily: 'var(--font)', background: '#f8fafc', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}>{children}</select>;
}

export function Textarea({ value, onChange, placeholder, error }) {
  return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 9, fontSize: 14, fontFamily: 'var(--font)', background: '#f8fafc', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />;
}

export function Btn({ variant, size, onClick, children, style }) {
  const v = { primary: { background: 'var(--primary)', color: '#fff', border: 'none' }, secondary: { background: '#e0e7ff', color: 'var(--primary)', border: 'none' }, ghost: { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }, danger: { background: '#fef2f2', color: 'var(--danger)', border: 'none' } }[variant || 'ghost'];
  const s = size === 'sm' ? { padding: '7px 12px', fontSize: 12.5 } : { padding: '10px 16px', fontSize: 14 };
  return <button onClick={onClick} style={{ ...v, ...s, borderRadius: 9, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, ...style }}>{children}</button>;
}

export function Badge({ status }) {
  const m = { active: { bg: '#ecfdf5', color: '#059669' }, inactive: { bg: '#f1f5f9', color: '#64748b' }, paid: { bg: '#ecfdf5', color: '#059669' }, pending: { bg: '#fffbeb', color: '#d97706' } };
  const s = m[status] || m.inactive;
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: s.bg, color: s.color, textTransform: 'capitalize' }}>{status}</span>;
}

export function Table({ headers, empty, children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead><tr style={{ borderBottom: '2px solid var(--border)', background: '#f8fafc' }}>{headers.map((h, i) => { const l = typeof h === 'string' ? h : h.label; const a = typeof h === 'string' ? 'left' : (h.align || 'left'); return <th key={i} style={{ padding: '12px 14px', textAlign: a, fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{l}</th>; })}</tr></thead>
        <tbody>{empty ? <tr><td colSpan={headers.length} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No records found</td></tr> : children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children }) { return <tr style={{ borderBottom: '1px solid var(--border)', height: 56 }}>{children}</tr>; }

export function TD({ children, align, muted, mono, bold }) {
  return <td style={{ padding: '12px 14px', textAlign: align || 'left', color: muted ? 'var(--text-muted)' : 'var(--text)', fontFamily: mono ? 'var(--mono)' : 'var(--font)', fontWeight: bold ? 700 : 400, fontSize: 13.5, whiteSpace: 'nowrap' }}>{children}</td>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
      <div><h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>{title}</h1><p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{subtitle}</p></div>
      <div style={{ display: 'flex', gap: 10 }}>{actions}</div>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ padding: '9px 14px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 13.5, background: '#fafbfe', fontFamily: 'var(--font)', minWidth: 220, outline: 'none' }} />;
}

export function StatCard({ label, value, sub, subColor, icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}><span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span><span style={{ fontSize: 22 }}>{icon}</span></div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: subColor || 'var(--accent)', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

export function Toast({ message, type, onClose }) {
  const bg = type === 'error' ? '#fff0f1' : '#e8faf4'; const color = type === 'error' ? 'var(--danger)' : 'var(--accent)';
  return <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, background: bg, color: color, padding: '14px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 10 }}><span>{message}</span><button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: 'inherit' }}>×</button></div>;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius)', width: 400, maxWidth: '100%', padding: 24, boxShadow: 'var(--shadow)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="danger" onClick={onConfirm}>Delete</Btn></div>
      </div>
    </div>
  );
}
