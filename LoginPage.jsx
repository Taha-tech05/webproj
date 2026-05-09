import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #0f2570 0%, #1a3faa 50%, #2952d9 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-20%', right: '-10%',
    width: '600px', height: '600px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-15%', left: '-8%',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'rgba(0,196,140,0.08)', pointerEvents: 'none',
  },
  left: {
    flex: 1, display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '60px',
    color: '#fff', position: 'relative', zIndex: 1,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '60px' },
  brandIcon: {
    width: '52px', height: '52px', background: '#fff', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: '800', color: 'var(--primary)',
  },
  brandName: { fontSize: '20px', fontWeight: '700', letterSpacing: '-0.3px' },
  heroTitle: { fontSize: '48px', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' },
  heroAccent: { color: '#00c48c' },
  heroSub: { fontSize: '17px', opacity: 0.75, lineHeight: 1.7, maxWidth: '400px', marginBottom: '48px' },
  stats: { display: 'flex', gap: '32px' },
  stat: {},
  statNum: { fontSize: '28px', fontWeight: '800', color: '#00c48c' },
  statLabel: { fontSize: '13px', opacity: 0.65, marginTop: '2px' },
  right: {
    width: '480px', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 50px', position: 'relative', zIndex: 1,
  },
  form: { width: '100%' },
  formTitle: { fontSize: '28px', fontWeight: '800', color: '#0d1b3e', marginBottom: '6px', letterSpacing: '-0.5px' },
  formSub: { color: '#7a8bbf', fontSize: '14px', marginBottom: '36px' },
  demoBox: {
    background: '#f0f4ff', borderRadius: '10px', padding: '14px 16px',
    marginBottom: '28px', border: '1px solid #dce6ff',
  },
  demoTitle: { fontSize: '12px', fontWeight: '700', color: '#1a3faa', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  demoItem: { fontSize: '12px', color: '#4a5fa8', fontFamily: 'DM Mono, monospace', lineHeight: '1.8' },
  group: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#0d1b3e', marginBottom: '8px' },
  input: {
    width: '100%', padding: '13px 16px', border: '2px solid #e2e8f4',
    borderRadius: '10px', fontSize: '14px', color: '#0d1b3e',
    outline: 'none', transition: 'border-color 0.2s',
    background: '#fafbfe',
  },
  select: {
    width: '100%', padding: '13px 16px', border: '2px solid #e2e8f4',
    borderRadius: '10px', fontSize: '14px', color: '#0d1b3e',
    outline: 'none', background: '#fafbfe', appearance: 'none',
  },
  error: {
    background: '#fff0f1', border: '1px solid #ffd0d3', borderRadius: '8px',
    padding: '10px 14px', color: '#c0392b', fontSize: '13px', marginBottom: '16px',
  },
  btn: {
    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1a3faa, #2952d9)',
    color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.2px',
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 4px 16px rgba(26,63,170,0.3)',
  },
  signupLink: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7a8bbf' },
  link: { color: '#1a3faa', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const ok = login(email, password, role);
    if (!ok) setError('Invalid credentials. Use demo accounts below.');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('Signup is disabled in demo mode. Please use the demo accounts to login.');
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>F</div>
          <span style={styles.brandName}>Financial Tracking System</span>
        </div>
        <h1 style={styles.heroTitle}>
          Manage Funds.<br />
          <span style={styles.heroAccent}>Track Impact.</span><br />
          Stay Clear.
        </h1>
        <p style={styles.heroSub}>
          A complete platform for managing donors, donations, projects, and expenses — built for transparency and accountability.
        </p>
        <div style={styles.stats}>
          {[['45+', 'Donors Managed'], ['Rs 1.25M', 'Total Donations'], ['5', 'Active Projects']].map(([num, label]) => (
            <div key={label} style={styles.stat}>
              <div style={styles.statNum}>{num}</div>
              <div style={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.form}>
          <h2 style={styles.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p style={styles.formSub}>{mode === 'login' ? 'Sign in to your account to continue' : 'Register a new user account'}</p>

          {mode === 'login' && (
            <div style={styles.demoBox}>
              <div style={styles.demoTitle}>Demo Credentials</div>
              <div style={styles.demoItem}>admin@fts.com — Admin</div>
              <div style={styles.demoItem}>operator@fts.com — Operator</div>
              <div style={styles.demoItem}>viewer@fts.com — Viewer</div>
              <div style={styles.demoItem}>Password: password123</div>
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            {mode === 'signup' && (
              <div style={styles.group}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Enter full name" required />
              </div>
            )}
            <div style={styles.group}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {mode === 'signup' && (
              <div style={styles.group}>
                <label style={styles.label}>Role</label>
                <select style={styles.select} value={role} onChange={e => setRole(e.target.value)}>
                  <option>Admin</option>
                  <option>Operator</option>
                  <option>Viewer</option>
                </select>
              </div>
            )}
            <button type="submit" style={styles.btn}>
              {mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <div style={styles.signupLink}>
            {mode === 'login' ? (
              <>Don't have an account? <span style={styles.link} onClick={() => { setMode('signup'); setError(''); }}>Sign up</span></>
            ) : (
              <>Already have an account? <span style={styles.link} onClick={() => { setMode('login'); setError(''); }}>Sign in</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
