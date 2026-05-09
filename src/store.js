import { createContext, useContext, useState, createElement } from 'react';

const initialDonors = [
  { id: 'd1', name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '+92 300 1234567', status: 'active', pledged: 500000, received: 350000, joined: 'Jan 2023' },
  { id: 'd2', name: 'Fatima Khan', email: 'fatima@example.com', phone: '+92 301 7654321', status: 'active', pledged: 750000, received: 750000, joined: 'Mar 2023' },
  { id: 'd3', name: 'Hassan Raza', email: 'hassan@example.com', phone: '+92 302 1122334', status: 'active', pledged: 1000000, received: 500000, joined: 'Jun 2023' },
  { id: 'd4', name: 'Ayesha Siddiqui', email: 'ayesha@example.com', phone: '+92 303 9988776', status: 'inactive', pledged: 200000, received: 100000, joined: 'Sep 2023' },
];

const initialProjects = [
  { id: 'p1', name: 'Education', description: 'Scholarships and school supplies for underprivileged students.', budget: 500000, status: 'active', income: 350000, expenses: 150000 },
  { id: 'p2', name: 'Health', description: 'Free medical camps and medicine distribution.', budget: 1000000, status: 'active', income: 600000, expenses: 400000 },
  { id: 'p3', name: 'Infrastructure', description: 'Road repairs and community center construction.', budget: 800000, status: 'active', income: 200000, expenses: 100000 },
  { id: 'p4', name: 'Community', description: 'Skill development and vocational training.', budget: 300000, status: 'active', income: 180000, expenses: 50000 },
  { id: 'p5', name: 'Environment', description: 'Tree plantation and waste management drives.', budget: 250000, status: 'inactive', income: 50000, expenses: 20000 },
];

const initialDonations = [
  { id: 'dn1', date: '2024-01-15', donorId: 'd1', projectId: 'p1', donor: 'Ahmed Ali', project: 'Education', month: 'January', paymentMode: 'Bank Transfer', amount: 100000, status: 'paid', notes: '', enteredBy: 'Admin' },
  { id: 'dn2', date: '2024-02-20', donorId: 'd2', projectId: 'p2', donor: 'Fatima Khan', project: 'Health', month: 'February', paymentMode: 'Cash', amount: 250000, status: 'paid', notes: '', enteredBy: 'Admin' },
  { id: 'dn3', date: '2024-03-10', donorId: 'd3', projectId: 'p3', donor: 'Hassan Raza', project: 'Infrastructure', month: 'March', paymentMode: 'Check', amount: 150000, status: 'pending', notes: '', enteredBy: 'Admin' },
  { id: 'dn4', date: '2024-04-05', donorId: 'd1', projectId: 'p2', donor: 'Ahmed Ali', project: 'Health', month: 'April', paymentMode: 'Online Transfer', amount: 50000, status: 'paid', notes: '', enteredBy: 'Admin' },
  { id: 'dn5', date: '2024-05-12', donorId: 'd2', projectId: 'p1', donor: 'Fatima Khan', project: 'Education', month: 'May', paymentMode: 'Bank Transfer', amount: 200000, status: 'pending', notes: '', enteredBy: 'Admin' },
];

const initialExpenses = [
  { id: 'e1', date: '2024-01-18', projectId: 'p1', project: 'Education', description: 'Textbooks and learning materials', paymentMode: 'Bank Transfer', amount: 25000 },
  { id: 'e2', date: '2024-01-15', projectId: 'p2', project: 'Health', description: 'Medical supplies and equipment', paymentMode: 'Cash', amount: 45000 },
  { id: 'e3', date: '2024-01-10', projectId: 'p3', project: 'Infrastructure', description: 'Cement and labor costs', paymentMode: 'Check', amount: 120000 },
  { id: 'e4', date: '2024-01-08', projectId: 'p4', project: 'Community', description: 'Event organization expenses', paymentMode: 'Cash', amount: 15000 },
  { id: 'e5', date: '2024-01-05', projectId: 'p1', project: 'Education', description: 'Staff salaries and allowances', paymentMode: 'Bank Transfer', amount: 85000 },
  { id: 'e6', date: '2024-01-02', projectId: 'p2', project: 'Health', description: 'Equipment maintenance', paymentMode: 'Check', amount: 35000 },
];

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [donors, setDonors] = useState(initialDonors);
  const [projects, setProjects] = useState(initialProjects);
  const [donations, setDonations] = useState(initialDonations);
  const [expenses, setExpenses] = useState(initialExpenses);

  const recalcProject = (projectId, nextDonations, nextExpenses) => {
    const income = nextDonations
      .filter(d => d.projectId === projectId && d.status === 'paid')
      .reduce((s, d) => s + d.amount, 0);
    const projectExpenses = nextExpenses
      .filter(e => e.projectId === projectId)
      .reduce((s, e) => s + e.amount, 0);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, income, expenses: projectExpenses } : p));
  };

  const recalcDonor = (donorId, nextDonations) => {
    const received = nextDonations
      .filter(d => d.donorId === donorId && d.status === 'paid')
      .reduce((s, d) => s + d.amount, 0);
    setDonors(prev => prev.map(d => d.id === donorId ? { ...d, received } : d));
  };

  // Donors
  const addDonor = (data) => {
    const id = 'd' + (Date.now());
    setDonors(prev => [...prev, { ...data, id, received: 0 }]);
  };
  const updateDonor = (id, data) => {
    setDonors(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  };
  const deleteDonor = (id) => {
    setDonors(prev => prev.filter(d => d.id !== id));
    setDonations(prev => prev.filter(d => d.donorId !== id));
  };

  // Projects
  const addProject = (data) => {
    const id = 'p' + (Date.now());
    setProjects(prev => [...prev, { ...data, id, income: 0, expenses: 0 }]);
  };
  const updateProject = (id, data) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Donations
  const addDonation = (data, user) => {
    const id = 'dn' + (Date.now());
    const donor = donors.find(d => d.id === data.donorId);
    const project = projects.find(p => p.id === data.projectId);
    const next = [...donations, {
      ...data,
      id,
      donor: donor?.name || '',
      project: project?.name || '',
      enteredBy: user?.name || 'System',
    }];
    setDonations(next);
    recalcProject(data.projectId, next, expenses);
    recalcDonor(data.donorId, next);
  };
  const updateDonation = (id, data, user) => {
    const donor = donors.find(d => d.id === data.donorId);
    const project = projects.find(p => p.id === data.projectId);
    const next = donations.map(d => d.id === id ? { ...d, ...data, donor: donor?.name || d.donor, project: project?.name || d.project, enteredBy: user?.name || d.enteredBy } : d);
    setDonations(next);
    const old = donations.find(d => d.id === id);
    if (old) {
      recalcProject(old.projectId, next, expenses);
      recalcDonor(old.donorId, next);
    }
    if (data.projectId && data.projectId !== old?.projectId) recalcProject(data.projectId, next, expenses);
    if (data.donorId && data.donorId !== old?.donorId) recalcDonor(data.donorId, next);
  };
  const deleteDonation = (id) => {
    const old = donations.find(d => d.id === id);
    const next = donations.filter(d => d.id !== id);
    setDonations(next);
    if (old) {
      recalcProject(old.projectId, next, expenses);
      recalcDonor(old.donorId, next);
    }
  };

  // Expenses
  const addExpense = (data) => {
    const id = 'e' + (Date.now());
    const project = projects.find(p => p.id === data.projectId);
    const next = [...expenses, { ...data, id, project: project?.name || '' }];
    setExpenses(next);
    if (data.projectId) recalcProject(data.projectId, donations, next);
  };
  const updateExpense = (id, data) => {
    const project = projects.find(p => p.id === data.projectId);
    const next = expenses.map(e => e.id === id ? { ...e, ...data, project: project?.name || e.project } : e);
    setExpenses(next);
    const old = expenses.find(e => e.id === id);
    if (old?.projectId) recalcProject(old.projectId, donations, next);
    if (data.projectId && data.projectId !== old?.projectId) recalcProject(data.projectId, donations, next);
  };
  const deleteExpense = (id) => {
    const old = expenses.find(e => e.id === id);
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    if (old?.projectId) recalcProject(old.projectId, donations, next);
  };

  return createElement(StoreContext.Provider, {
    value: {
      donors, projects, donations, expenses,
      addDonor, updateDonor, deleteDonor,
      addProject, updateProject, deleteProject,
      addDonation, updateDonation, deleteDonation,
      addExpense, updateExpense, deleteExpense,
    }
  }, children);
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
