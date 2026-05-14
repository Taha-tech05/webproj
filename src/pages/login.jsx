import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => { setLoaded(true); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace(result.user.role === 'Admin' ? '/dashboard' : '/donors');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .error-shake { animation: shake 0.4s ease; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
      `}</style>

      {/* Animated background elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 8s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite', animationDelay: '1s' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', transform: 'translate(-50%, -50%)', animation: 'float 12s ease-in-out infinite', animationDelay: '2s' }} />

      {/* Noise texture overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, mixBlendMode: 'overlay', backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }} />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: loaded ? 1 : 0,
          animation: loaded ? 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          width: '100%',
          maxWidth: '420px',
          padding: '0 20px'
        }}
      >
        {/* Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '48px 36px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top gradient accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8), transparent)' }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '500' }}>
              Sign in to continue to Financial Tracking
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-shake" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '24px',
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

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '8px',
                  letterSpacing: '0.01em'
                }}
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${emailFocus ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: emailFocus ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
                  fontFamily: 'inherit'
                }}
                placeholder="you@company.com"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                    letterSpacing: '0.01em'
                  }}
                >
                  Password
                </label>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                required
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${passFocus ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: passFocus ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none',
                  fontFamily: 'inherit'
                }}
                placeholder="••••••••"
              />
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Don't have an account?{' '}
              <a
                href="/signup"
                style={{
                  color: 'rgba(99, 102, 241, 0.9)',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.target.style.color = 'rgba(99, 102, 241, 1)'}
                onMouseLeave={e => e.target.style.color = 'rgba(99, 102, 241, 0.9)'}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}