export const mockDonors = [
    { id: 1, name: 'Ahmed Ali', pledged: 50000, received: 35000, email: 'ahmed@example.com' },
    { id: 2, name: 'Fatima Khan', pledged: 75000, received: 75000, email: 'fatima@example.com' },
    { id: 3, name: 'Hassan Raza', pledged: 100000, received: 50000, email: 'hassan@example.com' },
];

export const mockProjects = [
    { id: 1, name: 'Education Initiative', budget: 500000, expenses: 250000, status: 'active' },
    { id: 2, name: 'Health Clinic', budget: 1000000, expenses: 750000, status: 'active' },
    { id: 3, name: 'Water Supply', budget: 300000, expenses: 100000, status: 'pending' },
];

export const mockDonations = [
    { id: 1, donor: 'Ahmed Ali', amount: 10000, date: '2024-01-15', project: 'Education Initiative' },
    { id: 2, donor: 'Fatima Khan', amount: 25000, date: '2024-02-20', project: 'Health Clinic' },
    { id: 3, donor: 'Hassan Raza', amount: 15000, date: '2024-03-10', project: 'Water Supply' },
];

export const monthlyData = [
    { month: 'Jan', donations: 45000, expenses: 20000 },
    { month: 'Feb', donations: 65000, expenses: 35000 },
    { month: 'Mar', donations: 55000, expenses: 28000 },
    { month: 'Apr', donations: 75000, expenses: 42000 },
    { month: 'May', donations: 85000, expenses: 50000 },
    { month: 'Jun', donations: 95000, expenses: 55000 },
];
