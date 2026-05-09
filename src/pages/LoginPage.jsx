import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

const orb = (sz, x, y, color, delay) => ({
  position: 'absolute',
  width: sz,
  height: sz,
  borderRadius: '50%',
  background: color,
  filter: 'blur(60px)',
  opacity: 0.45,
  left: x,
  top: y,
  animation: `float ${6 + delay}s ease-in-out infinite alternate`,
  animationDelay: `${delay}s`,
});

const glassCard = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '24px',
  boxShadow: '0 25px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '14px',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
  fontFamily: 'inherit',
};

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [hovered, setHovered] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#060b1f',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    }}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Animated background orbs */}
      <div style={orb('500px', '-10%', '-10%', 'radial-gradient(circle, #2952d9 0%, transparent 70%)', 0)} />
      <div style={orb('400px', '60%', '-5%', 'radial-gradient(circle, #6b4ce6 0%, transparent 70%)', 2)} />
      <div style={orb('350px', '20%', '55%', 'radial-gradient(circle, #00c48c 0%, transparent 70%)', 1)} />
      <div style={orb('300px', '75%', '50%', 'radial-gradient(circle, #2952d9 0%, transparent 70%)', 3)} />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }} />
      ))}

      {/* Main card */}
      <div style={{
        ...glassCard,
        width: '420px',
        maxWidth: '92vw',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Top glow line */}
        <div style={{
          position: 'absolute',
          top: 0, left: '15%', right: '15%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #2952d9, #6b4ce6)',
            borderRadius: '18px',
            display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontWeight: '800', color: '#fff',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(41,82,217,0.35)',
          }}>
            F
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            Financial Tracking
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
            Sign in to your workspace
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.35)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.35)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            />
          </div>

          <button
            type="submit"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: '100%',
              padding: '14px',
              background: hovered
                ? 'linear-gradient(135deg, #3b64f0, #7d5cf0)'
                : 'linear-gradient(135deg, #2952d9, #6b4ce6)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'background 0.3s, transform 0.15s, box-shadow 0.3s',
              transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: hovered
                ? '0 8px 28px rgba(41,82,217,0.45)'
                : '0 4px 16px rgba(41,82,217,0.3)',
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px',
          border: '1px dashed rgba(255,255,255,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Demo Credentials
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--mono)' }}>
            demo@example.com / password
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            Admin & Operator roles supported
          </p>
        </div>
      </div>
    </div>
  );
}

