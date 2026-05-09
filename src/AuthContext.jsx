import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = 'http://localhost:4000';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true until we resolve token from storage

    // On mount, restore session from localStorage token
    useEffect(() => {
        const token = localStorage.getItem('ft_token');
        const stored = localStorage.getItem('ft_user');
        if (token && stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('ft_token');
                localStorage.removeItem('ft_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.error || 'Login failed' };
        }
        localStorage.setItem('ft_token', data.token);
        localStorage.setItem('ft_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
    };

    const register = async (name, email, password, role = 'Operator') => {
        const res = await fetch(`${API}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, error: data.error || 'Registration failed' };
        }
        return { success: true };
    };

    const logout = async () => {
        localStorage.removeItem('ft_token');
        localStorage.removeItem('ft_user');
        setUser(null);
        try {
            await fetch(`${API}/api/auth/logout`, { method: 'POST' });
        } catch {
            // ignore — stateless JWT logout
        }
    };

    const getToken = () => localStorage.getItem('ft_token');

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
