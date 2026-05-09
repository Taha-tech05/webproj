import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Donors from './pages/Donors.jsx';
import Donations from './pages/Donations.jsx';
import Projects from './pages/Projects.jsx';
import Expenses from './pages/Expenses.jsx';
import Reports from './pages/Reports.jsx';
import Users from './pages/Users.jsx';

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <LoginPage />;

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    donors: <Donors />,
    donations: <Donations />,
    projects: <Projects />,
    expenses: <Expenses />,
    reports: <Reports />,
    users: <Users />,
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {pages[page] || <Dashboard onNavigate={setPage} />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
