import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../AuthContext.jsx';
import API_BASE_URL from '../../lib/api.js';

const getRoleColor = (role) => {
    const colors = { Admin: { bg: '#ede9fe', text: '#5b21b6' }, Operator: { bg: '#e0f2fe', text: '#0369a1' }, Viewer: { bg: '#f1f5f9', text: '#475569' } };
    return colors[role] || { bg: '#f1f5f9', text: '#475569' };
};

const getStatusColor = (status) =>
    status === 'active' ? { bg: '#dcfce7', text: '#166534' } : { bg: '#fee2e2', text: '#991b1b' };

const getInitial = (name) => name?.charAt(0).toUpperCase() || 'U';

const getInitialBg = (name) => {
    const colors = ['#5c6bc0', '#1976d2', '#0097a7', '#00796b', '#d32f2f'];
    return colors[name?.charCodeAt(0) % colors.length || 0];
};

export default function Users() {
    const { user, getToken } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const isAdmin = user?.role === 'Admin';
    const API = `${API_BASE_URL}/api/users`;

    const headers = {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(API, { headers });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users.map(u => ({ ...u, status: u.is_active ? 'active' : 'inactive' })));
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    useEffect(() => {
        if (user) fetchUsers();
    }, [user]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleStatus = async (id, currentStatus) => {
        if (!isAdmin) return;
        const res = await fetch(`${API}/${id}/status`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ is_active: currentStatus !== 'active' })
        });
        if (res.ok) fetchUsers();
    };

    const changeRole = async (id, newRole) => {
        if (!isAdmin) return;
        const res = await fetch(`${API}/${id}/role`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ role: newRole })
        });
        if (res.ok) fetchUsers();
    };

    return (
        <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                    Users Directory
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {isAdmin ? 'Admin View — view, activate/deactivate, and change user roles' : 'Operator View — view access only'}
                </p>
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
                    {isAdmin && (
                        <button style={{ padding: '10px 20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                            + Add User
                        </button>
                    )}
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
                                const isSelf = u.email === user.email;
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
                                                        {isSelf && <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '12px' }}> (You)</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{u.email}</td>
                                        <td style={{ padding: '14px' }}>
                                            {isAdmin && !isSelf ? (
                                                <select
                                                    value={u.role}
                                                    onChange={e => changeRole(u.id, e.target.value)}
                                                    style={{ padding: '4px 10px', borderRadius: '6px', border: `1.5px solid ${roleColor.text}40`, background: roleColor.bg, color: roleColor.text, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Operator">Operator</option>
                                                    <option value="Viewer">Viewer</option>
                                                </select>
                                            ) : (
                                                <span style={{ padding: '4px 10px', borderRadius: '6px', border: `1px solid ${roleColor.text}40`, background: roleColor.bg, color: roleColor.text, fontSize: '12px', fontWeight: '600' }}>
                                                    {u.role}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px' }}>
                                            <span style={{ background: statusColor.bg, color: statusColor.text, padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px' }}>
                                            {isAdmin ? (
                                                <button
                                                    onClick={() => toggleStatus(u.id, u.status)}
                                                    disabled={isSelf}
                                                    style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border)', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: isSelf ? 'not-allowed' : 'pointer', color: u.status === 'active' ? '#dc2626' : '#16a34a', opacity: isSelf ? 0.4 : 1 }}
                                                >
                                                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No actions required</span>
                                            )}
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
