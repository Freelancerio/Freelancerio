let usersCache = [];
let jobsCache = [];
let appsCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadSummary();
  await loadUsers();
  await loadJobs();
  await loadApplications();

  document.getElementById("filter-role").addEventListener("change", loadUsers);
  document.getElementById("filter-job-category").addEventListener("change", loadJobs);
  document.getElementById("export-csv").addEventListener("click", exportDashboardCSV);
  document.getElementById("export-pdf").addEventListener("click", exportDashboardPDF);
});

async function loadUsers() {
  const role = document.getElementById("filter-role").value;
  const res = await fetch(`http://localhost:3000/dashboard/users${role ? `?role=${role}` : ''}`);
  usersCache = await res.json();
  const table = document.getElementById("users-table");
  table.innerHTML = `
    <thead><tr><th>ID</th><th>Username</th><th>Role</th></tr></thead>
    <tbody>
      ${usersCache.map(u => `<tr><td>${u.id_from_third_party}</td><td>${u.third_party_name}</td><td>${u.role}</td></tr>`).join('')}
    </tbody>
  `;
}

async function loadJobs() {
  const category = document.getElementById("filter-job-category").value;
  const res = await fetch(`http://localhost:3000/dashboard/jobs${category ? `?category=${category}` : ''}`);
  jobsCache = await res.json();
  const table = document.getElementById("jobs-table");
  table.innerHTML = `
    <thead><tr><th>Title</th><th>Category</th><th>Pay</th></tr></thead>
    <tbody>
      ${jobsCache.map(j => `<tr><td>${j.job_title}</td><td>${j.job_category}</td><td>${j.total_pay}</td></tr>`).join('')}
    </tbody>
  `;
}

async function loadApplications() {
  const res = await fetch(`http://localhost:3000/dashboard/applications`);
  appsCache = await res.json();
  const table = document.getElementById("apps-table");
  table.innerHTML = `
    <thead><tr><th>Client ID</th><th>User ID</th><th>Status</th></tr></thead>
    <tbody>
      ${appsCache.map(a => `<tr><td>${a.client_id}</td><td>${a.user_id}</td><td>${a.status}</td></tr>`).join('')}
    </tbody>
  `;
}

async function loadSummary() {
  const res = await fetch('http://localhost:3000/dashboard/summary');
  const data = await res.json();
  document.getElementById('summary').innerHTML = `
    <div class="bg-white p-4 shadow rounded">Total Users: ${data.totalUsers}</div>
    <div class="bg-white p-4 shadow rounded">Total Jobs: ${data.totalJobs}</div>
    <div class="bg-white p-4 shadow rounded">Applications: ${data.totalApps}</div>
    <div class="bg-white p-4 shadow rounded">Freelancers: ${data.freelancers}</div>
    <div class="bg-white p-4 shadow rounded">Clients: ${data.clients}</div>
    <div class="bg-white p-4 shadow rounded">By Category: ${JSON.stringify(data.jobsByCategory)}</div>
  `;
}

async function exportDashboardPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  // Title
  doc.setFontSize(18);
  doc.text("Admin Dashboard Report", 14, y);
  y += 10;

  // Summary
  doc.setFontSize(14);
  doc.text("Summary", 14, y);
  y += 8;
  doc.setFontSize(11);
  const summary = await fetch('http://localhost:3000/dashboard/summary').then(res => res.json());

  Object.entries(summary).forEach(([key, value]) => {
    if (typeof value === "object") {
      doc.text(`${key}:`, 14, y);
      y += 6;
      Object.entries(value).forEach(([k, v]) => {
        doc.text(`  - ${k}: ${v}`, 14, y);
        y += 6;
      });
    } else {
      doc.text(`${key}: ${value}`, 14, y);
      y += 6;
    }
  });

  y += 6;

  const addTable = (title, data, columns) => {
    doc.setFontSize(14);
    doc.text(title, 14, y);
    y += 2;
    doc.autoTable({
      startY: y,
      head: [columns],
      body: data.map(obj => columns.map(col => obj[col])),
      margin: { left: 14, right: 14 },
      styles: { fontSize: 10 },
    });
    y = doc.autoTable.previous.finalY + 10;
  };

  addTable("Users", usersCache, ["id_from_third_party", "third_party_name", "role"]);
  addTable("Jobs", jobsCache, ["job_title", "job_category", "total_pay"]);
  addTable("Applications", appsCache, ["client_id", "user_id", "status"]);

  doc.save("dashboard_report.pdf");
}

function exportDashboardCSV() {
  // Prepare your data (users, jobs, applications, summary)
  const exportable = [];

  // Add Summary Section
  exportable.push({ Section: 'Summary' });
  fetch('http://localhost:3000/dashboard/summary')
    .then(res => res.json())
    .then(summary => {
      for (let key in summary) {
        if (typeof summary[key] === 'object') {
          exportable.push({ [key]: '' });
          for (let sub in summary[key]) {
            exportable.push({ [sub]: summary[key][sub] });
          }
        } else {
          exportable.push({ [key]: summary[key] });
        }
      }

      // Add Users Section
      exportable.push({});
      exportable.push({ Section: 'Users' });
      exportable.push({ ID: 'ID', Name: 'Username', Role: 'Role' });
      usersCache.forEach(u => {
        exportable.push({
          ID: u.id_from_third_party,
          Name: u.third_party_name,
          Role: u.role
        });
      });

      // Add Jobs Section
      exportable.push({});
      exportable.push({ Section: 'Jobs' });
      exportable.push({ Title: 'Job Title', Category: 'Job Category', Pay: 'Total Pay' });
      jobsCache.forEach(j => {
        exportable.push({
          Title: j.job_title,
          Category: j.job_category,
          Pay: j.total_pay
        });
      });

      // Add Applications Section
      exportable.push({});
      exportable.push({ Section: 'Applications' });
      exportable.push({ Client: 'Client ID', User: 'User ID', Status: 'Status' });
      appsCache.forEach(a => {
        exportable.push({
          Client: a.client_id,
          User: a.user_id,
          Status: a.status
        });
      });

      // Convert the data to CSV format
      const csv = convertToCSV(exportable);

      // Create a Blob for the CSV content and trigger download
      downloadCSV(csv);
    });
}

// Function to convert JSON data to CSV
function convertToCSV(data) {
  const rows = [];

  // Get headers from the first object in the data
  const headers = Object.keys(data[0]);
  rows.push(headers.join(',')); // Add headers to CSV

  // Loop through each object and create a CSV row for it
  data.forEach(item => {
    const values = headers.map(header => item[header] || ''); // Handle missing values
    rows.push(values.join(','));
  });

  // Join all rows with a newline
  return rows.join('\n');
}

// Function to download CSV file
function downloadCSV(csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) { // Check if the browser supports 'download'
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'dashboard_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
