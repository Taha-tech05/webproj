import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../AuthContext.jsx';

const orb = (sz, x, y, color, delay) => ({
  position: 'absolute',
  width: sz, height: sz,
  borderRadius: '50%',
  background: color,
  filter: 'blur(60px)',
  opacity: 0.4,
  left: x, top: y,
  animation: `orbFloat ${7 + delay}s ease-in-out infinite alternate`,
  animationDelay: `${delay}s`,
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => { setLoaded(true); }, []);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dx * -6, y: dy * 6 });
    setSpotlight({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  };

  const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace(result.user.role === 'Admin' ? '/dashboard' : '/operator-dashboard');
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060b1f', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', perspective: '1200px' }}
    >
      <style>{`
        @keyframes orbFloat { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-35px) scale(1.08); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(40px) scale(0.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes dustFloat { 0%{transform:translateY(0)} 100%{transform:translateY(-20px)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .error-shake { animation: shake 0.4s ease; }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, rgba(41,82,217,0.12), transparent 60%)`, pointerEvents: 'none', zIndex: 1, transition: 'background 0.4s ease-out' }} />

      <div style={orb('520px', '-12%', '-12%', 'radial-gradient(circle, #2952d9 0%, transparent 70%)', 0)} />
      <div style={orb('420px', '55%', '-8%', 'radial-gradient(circle, #7b4cf0 0%, transparent 70%)', 2.5)} />
      <div style={orb('380px', '15%', '60%', 'radial-gradient(circle, #00c48c 0%, transparent 70%)', 1.2)} />
      <div style={orb('340px', '78%', '52%', 'radial-gradient(circle, #2952d9 0%, transparent 70%)', 3.5)} />

      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', left: `${(i * 17) % 100}%`, top: `${(i * 13) % 100}%`, animation: `dustFloat ${4 + (i % 5)}s ease-in-out infinite alternate`, animationDelay: `${i * 0.25}s`, pointerEvents: 'none' }} />
      ))}

      <div
        ref={cardRef}
        style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out', opacity: loaded ? 1 : 0, animation: loaded ? 'slideUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards' : 'none', position: 'relative', zIndex: 2 }}
      >
        <div style={{ position: 'absolute', inset: '-2px', borderRadius: '26px', background: 'conic-gradient(from 0deg, #2952d9, #7b4cf0, #00c48c, #2952d9)', animation: 'spin 4s linear infinite', opacity: 0.35, filter: 'blur(8px)' }} />

        <div style={{ width: '440px', maxWidth: '92vw', padding: '48px 42px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', boxShadow: '0 30px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }} />

          <div style={{ textAlign: 'center', marginBottom: '38px' }}>
            <div style={{ width: '68px', height: '68px', background: 'linear-gradient(135deg, #2952d9, #7b4cf0)', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '22px', boxShadow: '0 10px 40px rgba(41,82,217,0.4)' }}>F</div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(90deg, #fff, #a5b4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Financial Tracking</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Sign in to your workspace</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-shake" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ position: 'relative', marginBottom: '22px' }}>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
                style={{ width: '100%', padding: '26px 16px 10px 16px', background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${emailFocus ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s', boxShadow: emailFocus ? '0 0 0 3px rgba(41,82,217,0.15)' : 'none', fontFamily: 'inherit' }}
              />
              <label htmlFor="login-email" style={{ position: 'absolute', left: 16, top: email || emailFocus ? 6 : 18, fontSize: email || emailFocus ? 11 : 14, color: emailFocus ? '#8aa4ff' : 'rgba(255,255,255,0.4)', fontWeight: 600, transition: 'all 0.2s ease', pointerEvents: 'none' }}>
                Email address
              </label>
            </div>

            {/* Password */}
            <div style={{ position: 'relative', marginBottom: '30px' }}>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                required
                style={{ width: '100%', padding: '26px 16px 10px 16px', background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${passFocus ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.25s, box-shadow 0.25s', boxShadow: passFocus ? '0 0 0 3px rgba(41,82,217,0.15)' : 'none', fontFamily: 'inherit' }}
              />
              <label htmlFor="login-password" style={{ position: 'absolute', left: 16, top: password || passFocus ? 6 : 18, fontSize: password || passFocus ? 11 : 14, color: passFocus ? '#8aa4ff' : 'rgba(255,255,255,0.4)', fontWeight: 600, transition: 'all 0.2s ease', pointerEvents: 'none' }}>
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{ width: '100%', padding: '15px', background: submitting ? 'rgba(41,82,217,0.5)' : hovered ? 'linear-gradient(135deg, #3b68ff, #8a5cf5)' : 'linear-gradient(135deg, #2952d9, #7b4cf0)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '700', cursor: submitting ? 'wait' : 'pointer', transition: 'background 0.3s, transform 0.15s, box-shadow 0.3s', transform: hovered && !submitting ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hovered ? '0 12px 32px rgba(41,82,217,0.5)' : '0 6px 20px rgba(41,82,217,0.35)' }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              Don't have an account?{' '}
              <a href="/signup" style={{ color: '#8aa4ff', fontWeight: '600', textDecoration: 'none' }}>Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
