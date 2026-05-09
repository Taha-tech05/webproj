import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext.jsx';

export default function SignupPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Operator' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [focusField, setFocusField] = useState('');
    const router = useRouter();
    const { register } = useAuth();

    useEffect(() => { setLoaded(true); }, []);

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setSubmitting(true);
        try {
            const result = await register(form.name, form.email, form.password, form.role);
            if (result.success) {
                setSuccess('Account created! Redirecting to login…');
                setTimeout(() => router.replace('/login'), 1800);
            } else {
                setError(result.error || 'Registration failed.');
            }
        } catch {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const fields = [
        { id: 'name', label: 'Full Name', type: 'text', value: form.name },
        { id: 'email', label: 'Email Address', type: 'email', value: form.email },
        { id: 'password', label: 'Password', type: 'password', value: form.password },
        { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: form.confirmPassword },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b1f', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
            <style>{`
        @keyframes orbFloat { 0%{transform:translateY(0)} 100%{transform:translateY(-35px)} }
        @keyframes slideUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

            {/* Background orbs */}
            {[
                ['400px', '-8%', '-8%', '#2952d9', 0],
                ['360px', '60%', '-5%', '#7b4cf0', 2],
                ['320px', '10%', '65%', '#00c48c', 1],
            ].map(([sz, x, y, c, d], i) => (
                <div key={i} style={{ position: 'absolute', width: sz, height: sz, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0%, transparent 70%)`, filter: 'blur(60px)', opacity: 0.35, left: x, top: y, animation: `orbFloat ${7 + Number(d)}s ease-in-out infinite alternate`, animationDelay: `${d}s` }} />
            ))}

            <div style={{ position: 'relative', zIndex: 2, opacity: loaded ? 1 : 0, animation: loaded ? 'slideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards' : 'none', width: '460px', maxWidth: '94vw' }}>
                <div style={{ position: 'absolute', inset: '-2px', borderRadius: '26px', background: 'conic-gradient(from 0deg, #2952d9, #7b4cf0, #00c48c, #2952d9)', animation: 'spin 4s linear infinite', opacity: 0.3, filter: 'blur(8px)' }} />

                <div style={{ position: 'relative', padding: '44px 42px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', boxShadow: '0 30px 90px rgba(0,0,0,0.5)' }}>
                    <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #2952d9, #7b4cf0)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '18px', boxShadow: '0 10px 35px rgba(41,82,217,0.4)' }}>F</div>
                        <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #a5b4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '6px' }}>Create Account</h1>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Financial Tracking System</p>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', color: '#fca5a5', display: 'flex', gap: '8px' }}>
                            <span>⚠</span> {error}
                        </div>
                    )}
                    {success && (
                        <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', color: '#86efac', display: 'flex', gap: '8px' }}>
                            <span>✓</span> {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Text fields */}
                        {fields.map(f => (
                            <div key={f.id} style={{ position: 'relative', marginBottom: '18px' }}>
                                <input
                                    id={`signup-${f.id}`}
                                    type={f.type}
                                    value={f.value}
                                    onChange={handleChange(f.id)}
                                    onFocus={() => setFocusField(f.id)}
                                    onBlur={() => setFocusField('')}
                                    required
                                    style={{ width: '100%', padding: '26px 16px 10px 16px', background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${focusField === f.id ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s', boxShadow: focusField === f.id ? '0 0 0 3px rgba(41,82,217,0.15)' : 'none', fontFamily: 'inherit' }}
                                />
                                <label htmlFor={`signup-${f.id}`} style={{ position: 'absolute', left: 16, top: f.value || focusField === f.id ? 6 : 18, fontSize: f.value || focusField === f.id ? 11 : 14, color: focusField === f.id ? '#8aa4ff' : 'rgba(255,255,255,0.4)', fontWeight: 600, transition: 'all 0.2s ease', pointerEvents: 'none' }}>
                                    {f.label}
                                </label>
                            </div>
                        ))}

                        {/* Role selector */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['Operator', 'Admin'].map(role => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, role }))}
                                        style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `1.5px solid ${form.role === role ? 'rgba(122, 101, 240, 0.8)' : 'rgba(255,255,255,0.1)'}`, background: form.role === role ? 'rgba(122,101,240,0.15)' : 'rgba(255,255,255,0.03)', color: form.role === role ? '#a5b4ff' : 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        {role === 'Operator' ? '📊 Operator' : '🔑 Admin'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ width: '100%', padding: '14px', background: submitting ? 'rgba(41,82,217,0.5)' : 'linear-gradient(135deg, #2952d9, #7b4cf0)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer', transition: 'all 0.25s', boxShadow: '0 6px 20px rgba(41,82,217,0.35)' }}
                        >
                            {submitting ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                            Already have an account?{' '}
                            <a href="/login" style={{ color: '#8aa4ff', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
