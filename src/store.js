import { createContext, useContext, useState, useEffect, createElement } from 'react';
import { useAuth } from './AuthContext.jsx';

const StoreContext = createContext(null);
const API = 'http://localhost:4000/api';

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const normalizeDonor = (donor) => ({
  ...donor,
  pledged: toNumber(donor.pledged),
  received: toNumber(donor.received),
});

const normalizeProject = (project) => ({
  ...project,
  budget: toNumber(project.budget),
  income: toNumber(project.income),
  expenses: toNumber(project.expenses),
});

const normalizeDonation = (donation) => ({
  ...donation,
  donorId: donation.donorId != null ? Number(donation.donorId) : donation.donorId,
  projectId: donation.projectId != null ? Number(donation.projectId) : donation.projectId,
  amount: toNumber(donation.amount),
});

const normalizeExpense = (expense) => ({
  ...expense,
  projectId: expense.projectId != null ? Number(expense.projectId) : expense.projectId,
  amount: toNumber(expense.amount),
});

export function StoreProvider({ children }) {
  const { getToken, user } = useAuth();

  const [donors, setDonors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const headers = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  });

  const loadData = async () => {
    if (!user) return;
    try {
      const [pRes, dRes, dnRes, eRes] = await Promise.all([
        fetch(`${API}/projects`, { headers: headers() }),
        fetch(`${API}/donors`, { headers: headers() }),
        fetch(`${API}/donations`, { headers: headers() }),
        fetch(`${API}/expenses`, { headers: headers() })
      ]);
      if (pRes.ok) setProjects((await pRes.json()).map(normalizeProject));
      if (dRes.ok) setDonors((await dRes.json()).map(normalizeDonor));
      if (dnRes.ok) setDonations((await dnRes.json()).map(normalizeDonation));
      if (eRes.ok) setExpenses((await eRes.json()).map(normalizeExpense));
    } catch (err) {
      console.error('Failed to load store data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Donors
  const addDonor = async (data) => {
    const res = await fetch(`${API}/donors`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
  };
  const updateDonor = async (id, data) => {
    const res = await fetch(`${API}/donors/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
  };
  const deleteDonor = async (id) => {
    const res = await fetch(`${API}/donors/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) await loadData();
  };

  // Projects
  const addProject = async (data) => {
    const res = await fetch(`${API}/projects`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
  };
  const updateProject = async (id, data) => {
    const res = await fetch(`${API}/projects/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
  };
  const deleteProject = async (id) => {
    const res = await fetch(`${API}/projects/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) await loadData();
  };

  // Donations
  const addDonation = async (data) => {
    const res = await fetch(`${API}/donations`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
  };
  const updateDonation = async (id, data) => {
    const res = await fetch(`${API}/donations/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
  };
  const deleteDonation = async (id) => {
    const res = await fetch(`${API}/donations/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) await loadData();
  };

  // Expenses
  const addExpense = async (data) => {
    const res = await fetch(`${API}/expenses`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) {
      await loadData();
      return { success: true };
    }
    const error = await res.json().catch(() => ({}));
    return { success: false, error: error.error || 'Failed to record expense.' };
  };
  const deleteExpense = async (id) => {
    const res = await fetch(`${API}/expenses/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) await loadData();
  };

  return createElement(StoreContext.Provider, {
    value: {
      donors, projects, donations, expenses,
      addDonor, updateDonor, deleteDonor,
      addProject, updateProject, deleteProject,
      addDonation, updateDonation, deleteDonation,
      addExpense, deleteExpense,
      refreshData: loadData
    }
  }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
