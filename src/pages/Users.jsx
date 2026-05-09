import { useState } from 'react';

const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@university.edu', role: 'admin', status: 'active' },
    { id: 2, name: 'John Operator', email: 'john@university.edu', role: 'operator', status: 'active' },
    { id: 3, name: 'Sara Reader', email: 'sara@university.edu', role: 'viewer', status: 'active' },
    { id: 4, name: 'Ali Hassan', email: 'ali@university.edu', role: 'operator', status: 'active' },
    { id: 5, name: 'Fatima Khan', email: 'fatima@university.edu', role: 'viewer', status: 'inactive' },
];

const getRoleColor = (role) => {
    const colors = {
        admin: { bg: '#e8f5e9', text: '#2e7d32' },
        operator: { bg: '#e8f5e9', text: '#2e7d32' },
        viewer: { bg: '#e8f5e9', text: '#2e7d32' },
    };
    return colors[role] || { bg: '#e8f5e9', text: '#2e7d32' };
};

const getStatusColor = (status) => {
    return status === 'active' ? { bg: '#c8e6c9', text: '#2e7d32' } : { bg: '#ffcdd2', text: '#c62828' };
};

const getInitial = (name) => name.charAt(0).toUpperCase();

const getInitialColor = (name) => {
    const colors = ['#5c6bc0', '#1976d2', '#0097a7', '#00796b', '#d32f2f'];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
};

export default function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState(mockUsers);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                    Manage Users
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Admin Only</p>
            </div>

            <div style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                padding: '24px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ flex: 1, marginRight: '16px' }}>
                        <input
                            type="text"
                            placeholder="Search users..."
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
                        + Add User
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '14px',
                    }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Name</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Email</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Role</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, idx) => {
                                const roleColor = getRoleColor(user.role);
                                const statusColor = getStatusColor(user.status);
                                const bgColor = getInitialColor(user.name);

                                return (
                                    <tr key={user.id} style={{
                                        borderBottom: '1px solid var(--border)',
                                        height: '60px',
                                    }}>
                                        <td style={{ padding: '12px 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: bgColor,
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '16px',
                                                    flexShrink: 0,
                                                }}>
                                                    {getInitial(user.name)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>
                                                        {user.name}
                                                        {user.id === 1 && <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}> (You)</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 0', color: 'var(--text-muted)' }}>{user.email}</td>
                                        <td style={{ padding: '12px 0' }}>
                                            <span style={{
                                                background: roleColor.bg,
                                                color: roleColor.text,
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 0' }}>
                                            <span style={{
                                                background: statusColor.bg,
                                                color: statusColor.text,
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                            }}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 0' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '4px 8px',
                                                    }}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '4px 8px',
                                                    }}
                                                    title="Change role"
                                                >
                                                    👥
                                                </button>
                                                <button
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '18px',
                                                        padding: '4px 8px',
                                                        color: '#ff6b6b',
                                                    }}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
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
