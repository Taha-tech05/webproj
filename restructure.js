const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const routesToMigrate = [
    { old: 'Dashboard.jsx', newDir: 'dashboard' },
    { old: 'Donors.jsx', newDir: 'donors' },
    { old: 'Donations.jsx', newDir: 'donations' },
    { old: 'Projects.jsx', newDir: 'projects' },
    { old: 'Expenses.jsx', newDir: 'expenses' },
    { old: 'Reports.jsx', newDir: 'reports' },
    { old: 'Users.jsx', newDir: 'users' },
];

for (const route of routesToMigrate) {
    const oldPath = path.join(pagesDir, route.old);
    const newDirPath = path.join(pagesDir, route.newDir);
    const newPath = path.join(newDirPath, 'index.jsx');

    if (fs.existsSync(oldPath)) {
        if (!fs.existsSync(newDirPath)) {
            fs.mkdirSync(newDirPath, { recursive: true });
        }
        fs.renameSync(oldPath, newPath);
        console.log(`Moved ${route.old} -> ${route.newDir}/index.jsx`);
    }
}

const operatorDashPath = path.join(pagesDir, 'operator-dashboard.jsx');
if (fs.existsSync(operatorDashPath)) {
    fs.unlinkSync(operatorDashPath);
    console.log('Deleted operator-dashboard.jsx');
}

console.log('Restructuring complete.');
