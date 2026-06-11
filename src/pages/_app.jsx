import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../AuthContext.jsx';
import { StoreProvider } from '../store.js';
import Layout from '../components/Layout.jsx';
import '../index.css';

const pageMap = {
  '/dashboard': 'dashboard',
  '/donors': 'donors',
  '/donations': 'donations',
  '/projects': 'projects',
  '/expenses': 'expenses',
  '/reports': 'reports',
  '/users': 'users',
};

const routeMap = {
  dashboard: '/dashboard',
  donors: '/donors',
  donations: '/donations',
  projects: '/projects',
  expenses: '/expenses',
  reports: '/reports',
  users: '/users',
};

const operatorPages = ['/donors', '/donations', '/expenses'];
const adminLandingPage = '/dashboard';
const operatorLandingPage = '/donors';

function AppContent({ Component, pageProps }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isHome = router.pathname === '/' || router.pathname === '/home';
  const isLogin = router.pathname === '/login';
  const isSignup = router.pathname === '/signup';
  const isPublic = isHome || isLogin || isSignup;

  useEffect(() => {
    if (loading) return; // Wait until auth state is known — prevents flash/redirect loop

    if (!user && !isPublic) {
      router.replace('/login');
      return;
    }

    if (user && isPublic) {
      router.replace(user.role === 'Admin' ? adminLandingPage : operatorLandingPage);
      return;
    }

    if (user) {
      const path = router.pathname;
      if (user.role !== 'Admin' && !operatorPages.includes(path)) {
        router.replace(operatorLandingPage);
        return;
      }
    }
  }, [user, loading, router.pathname]);

  // While resolving auth state, show a minimal loading screen (prevents flash)
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg)',
        fontSize: '15px', color: 'var(--text-muted)',
      }}>
        Loading…
      </div>
    );
  }

  if (isPublic) {
    return <Component {...pageProps} />;
  }

  if (!user) return null; // Will redirect via useEffect above
  if (user.role !== 'Admin' && !operatorPages.includes(router.pathname)) return null;

  const currentPage = pageMap[router.pathname] || 'dashboard';
  const onNavigate = (id) => router.push(routeMap[id] || '/dashboard');

  return (
    <Layout currentPage={currentPage} onNavigate={onNavigate}>
      <Component {...pageProps} onNavigate={onNavigate} />
    </Layout>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </StoreProvider>
    </AuthProvider>
  );
}
