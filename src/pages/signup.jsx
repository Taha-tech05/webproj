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
        { id: 'name', label: 'Full Name', type: 'text', value: form.name, placeholder: 'John Doe' },
        { id: 'email', label: 'Email Address', type: 'email', value: form.email, placeholder: 'you@company.com' },
        { id: 'password', label: 'Password', type: 'password', value: form.password, placeholder: '••••••••' },
        { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: form.confirmPassword, placeholder: '••••••••' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '40px 20px'
        }}>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

            {/* Animated background elements */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite', animationDelay: '1s' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(-50%, -50%)', animation: 'float 12s ease-in-out infinite', animationDelay: '2s' }} />

            {/* Noise texture overlay */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.03, mixBlendMode: 'overlay', backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />

            <div style={{
                position: 'relative',
                zIndex: 2,
                opacity: loaded ? 1 : 0,
                animation: loaded ? 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                width: '100%',
                maxWidth: '440px'
            }}>
                {/* Card */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '44px 36px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Top gradient accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8), transparent)' }} />

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            borderRadius: '16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#fff',
                            marginBottom: '20px',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)', backgroundSize: '200% 200%', animation: 'shimmer 3s infinite' }} />
                            F
                        </div>
                        <h1 style={{
                            fontSize: '26px',
                            fontWeight: '700',
                            marginBottom: '8px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em'
                        }}>
                            Create your account
                        </h1>
                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>
                            Join Financial Tracking System
                        </p>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            marginBottom: '20px',
                            fontSize: '13px',
                            color: '#fca5a5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M8 4.5V8.5M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            marginBottom: '20px',
                            fontSize: '13px',
                            color: '#86efac',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M5 8.5L7 10.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Text fields */}
                        {fields.map(f => (
                            <div key={f.id} style={{ marginBottom: '18px' }}>
                                <label
                                    htmlFor={`signup-${f.id}`}
                                    style={{
                                        display: 'block',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        marginBottom: '8px',
                                        letterSpacing: '0.01em'
                                    }}
                                >
                                    {f.label}
                                </label>
                                <input
                                    id={`signup-${f.id}`}
                                    type={f.type}
                                    value={f.value}
                                    onChange={handleChange(f.id)}
                                    onFocus={() => setFocusField(f.id)}
                                    onBlur={() => setFocusField('')}
                                    required
                                    placeholder={f.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: '13px 16px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: `1px solid ${focusField === f.id ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '15px',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                        transition: 'all 0.2s ease',
                                        boxShadow: focusField === f.id ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                        ))}

                        {/* Role selector */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: '10px',
                                letterSpacing: '0.01em'
                            }}>
                                Select Role
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { role: 'Operator', icon: '📊', desc: 'Standard user' },
                                    { role: 'Admin', icon: '🔑', desc: 'Full access' }
                                ].map(({ role, icon, desc }) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, role }))}
                                        style={{
                                            padding: '14px 16px',
                                            borderRadius: '12px',
                                            border: `1px solid ${form.role === role ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                            background: form.role === role ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                            color: form.role === role ? '#e0e7ff' : 'rgba(255, 255, 255, 0.5)',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            boxShadow: form.role === role ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none'
                                        }}
                                        onMouseEnter={e => {
                                            if (form.role !== role) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (form.role !== role) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            }
                                        }}
                                    >
                                        <span style={{ fontSize: '20px' }}>{icon}</span>
                                        <span style={{ fontSize: '13px' }}>{role}</span>
                                        <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontWeight: '500' }}>{desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: submitting ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: submitting ? 'wait' : 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: submitting ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.4)',
                                position: 'relative',
                                overflow: 'hidden',
                                letterSpacing: '0.01em'
                            }}
                            onMouseEnter={e => {
                                if (!submitting) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.5)';
                                }
                            }}
                            onMouseLeave={e => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = submitting ? 'none' : '0 4px 16px rgba(99, 102, 241, 0.4)';
                            }}
                        >
                            {submitting ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="9 3" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.4)' }}>
                            Already have an account?{' '}
                            <a
                                href="/login"
                                style={{
                                    color: 'rgba(99, 102, 241, 0.9)',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.target.style.color = 'rgba(99, 102, 241, 1)'}
                                onMouseLeave={e => e.target.style.color = 'rgba(99, 102, 241, 0.9)'}
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}