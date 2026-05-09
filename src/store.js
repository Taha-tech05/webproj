import { createContext, useContext, useState, useEffect, createElement } from 'react';
import { useAuth } from './AuthContext.jsx';

const StoreContext = createContext(null);
const API = 'http://localhost:4000/api';

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
      if (pRes.ok) setProjects(await pRes.json());
      if (dRes.ok) setDonors(await dRes.json());
      if (dnRes.ok) setDonations(await dnRes.json());
      if (eRes.ok) setExpenses(await eRes.json());
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
  const deleteDonation = async (id) => {
    const res = await fetch(`${API}/donations/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) await loadData();
  };

  // Expenses
  const addExpense = async (data) => {
    const res = await fetch(`${API}/expenses`, { method: 'POST', headers: headers(), body: JSON.stringify(data) });
    if (res.ok) await loadData();
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
      addDonation, deleteDonation,
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
