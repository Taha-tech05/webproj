import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext.jsx';

const getRoleColor = (role) => {
    const colors = {
        Admin: { bg: '#ede9fe', text: '#5b21b6' },
        Operator: { bg: '#e0f2fe', text: '#0369a1' },
    };
    return colors[role] || { bg: '#f1f5f9', text: '#475569' };
};

const getStatusColor = (status) =>
    status === 'active' ? { bg: '#dcfce7', text: '#166534' } : { bg: '#fee2e2', text: '#991b1b' };

const getInitial = (name) => name.charAt(0).toUpperCase();

const getInitialBg = (name) => {
    const colors = ['#5c6bc0', '#1976d2', '#0097a7', '#00796b', '#d32f2f'];
    return colors[name.charCodeAt(0) % colors.length];
};

const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@uni.edu', role: 'Admin', status: 'active' },
    { id: 2, name: 'John Operator', email: 'john@uni.edu', role: 'Operator', status: 'active' },
    { id: 3, name: 'Sara Operator', email: 'sara@uni.edu', role: 'Operator', status: 'inactive' },
];

export default function Users() {
    const { user } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(mockUsers);

    // Admin-only guard
    if (!user || user.role !== 'Admin') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
                <div style={{ fontSize: '64px' }}>🚫</div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text)' }}>Access Denied</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>You do not have permission to view this page.</p>
                <button
                    onClick={() => router.back()}
                    style={{ padding: '10px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleStatus = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    };

    const changeRole = (id, newRole) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    };

    return (
        <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                    Manage Users
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Admin Only — view, activate/deactivate, and change user roles</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', width: '280px', background: '#fff', outline: 'none' }}
                    />
                    <button style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                        + Add User
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafbfe' }}>
                                {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: '700', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => {
                                const roleColor = getRoleColor(u.role);
                                const statusColor = getStatusColor(u.status);
                                return (
                                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: getInitialBg(u.name), color: '#fff', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
                                                    {getInitial(u.name)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>
                                                        {u.name}
                                                        {u.email === user.email && <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '12px' }}> (You)</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{u.email}</td>
                                        <td style={{ padding: '14px' }}>
                                            <select
                                                value={u.role}
                                                onChange={e => changeRole(u.id, e.target.value)}
                                                disabled={u.email === user.email}
                                                style={{ padding: '4px 10px', borderRadius: '6px', border: `1.5px solid ${roleColor.text}40`, background: roleColor.bg, color: roleColor.text, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Operator">Operator</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '14px' }}>
                                            <span style={{ background: statusColor.bg, color: statusColor.text, padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px' }}>
                                            <button
                                                onClick={() => toggleStatus(u.id)}
                                                disabled={u.email === user.email}
                                                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: u.email === user.email ? 'not-allowed' : 'pointer', color: u.status === 'active' ? '#dc2626' : '#16a34a', opacity: u.email === user.email ? 0.4 : 1 }}
                                            >
                                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
