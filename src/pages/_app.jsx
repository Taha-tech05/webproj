import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../AuthContext.jsx';
import { StoreProvider } from '../store.js';
import Layout from '../components/Layout.jsx';
import '../index.css';

const pageMap = {
  '/dashboard': 'dashboard',
  '/operator-dashboard': 'operator-dashboard',
  '/donors': 'donors',
  '/donations': 'donations',
  '/projects': 'projects',
  '/expenses': 'expenses',
  '/reports': 'reports',
  '/users': 'users',
  '/': 'dashboard',
};

const routeMap = {
  dashboard: '/dashboard',
  'operator-dashboard': '/operator-dashboard',
  donors: '/donors',
  donations: '/donations',
  projects: '/projects',
  expenses: '/expenses',
  reports: '/reports',
  users: '/users',
};

function AppContent({ Component, pageProps }) {
  const { user } = useAuth();
  const router = useRouter();
  const isLogin = router.pathname === '/login';

  useEffect(() => {
    if (!user && !isLogin) {
      router.replace('/login');
    }
    if (user && isLogin) {
      router.replace(user.role === 'Admin' ? '/dashboard' : '/operator-dashboard');
    }
  }, [user, isLogin, router]);

  if (isLogin) {
    return <Component {...pageProps} />;
  }

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
