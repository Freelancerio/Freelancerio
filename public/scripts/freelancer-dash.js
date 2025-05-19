// Update Chart
async function loadEarnings() {
    const res = await fetch('http://localhost:3000/api/earnings');
    const data = await res.json();
    const labels = data.map(item => item.month);
    const values = data.map(item => item.amount);

    const ctx = document.getElementById('earningsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Earnings ($)',
                data: values,
                borderColor: '#2196f3',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: value => '$' + value }
                }
            }
        }
    });
}

async function loadJobs() {
    const [activeRes, historyRes] = await Promise.all([
        fetch('http://localhost:3000/api/jobs/active'),
        fetch('http://localhost:3000/api/jobs/history'),
    ]);
    const activeJobs = await activeRes.json();
    const jobHistory = await historyRes.json();

    const activeTable = document.querySelector('tbody:nth-of-type(1)');
    const historyTable = document.querySelector('tbody:nth-of-type(2)');

    activeTable.innerHTML = activeJobs.map(job => `
    <tr>
      <td>${job.title}</td>
      <td>${job.client}</td>
      <td>$${job.amount}</td>
      <td><span class="status active">${job.status}</span></td>
      <td>${job.date}</td>
    </tr>`).join('');

    historyTable.innerHTML = jobHistory.map(job => `
    <tr>
      <td>${job.title}</td>
      <td>${job.client}</td>
      <td>$${job.amount}</td>
      <td><span class="status completed">${job.status}</span></td>
      <td>${job.date}</td>
    </tr>`).join('');
}

// Load on page
loadEarnings();
loadJobs();
