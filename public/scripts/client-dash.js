import getBaseUrl from './base-url.mjs';
const baseURL = getBaseUrl();

document.addEventListener('DOMContentLoaded', async function() {
    const jobs = await fetchJobs();
    console.log(jobs);
    
    // 1. Process data for pie chart (job durations)
    const durationArr = [0,0,0,0,0,0];
    let numMonths = 0;
    for (let i = 0; i < jobs.length;i++){
        numMonths = jobs[i].duration_months; 
        if (numMonths >= 1 && numMonths <= 3){
            durationArr[0] += 1;
        }
        else if (numMonths >= 4 && numMonths <= 6){
            durationArr[1] +=1;
        }
        else if (numMonths >= 7 && numMonths <= 9){
            durationArr[2] += 1;
        }
        else if (numMonths >= 10 && numMonths <= 12){
            durationArr[3] += 1;
        }
        else if (numMonths >= 13 && numMonths <= 15){
            durationArr[4] += 1;
        }
        else{
            durationArr[5] += 1;
        }
    }

    // 2. Create the pie chart
    createPieChart(durationArr);
    
    // 3. Create the bar chart (jobs per month)
    createBarChart(jobs);
    
    // 4. Update active jobs count
    const activeJobsCount = jobs.filter(job => !job.taken_status).length;
    document.getElementById("actJobs").innerHTML = 
        `<p class="text-lg font-semibold mb-2">🟢 Active Jobs: ${activeJobsCount}</p>`;
});

// Function to create the pie chart
function createPieChart(durationArr) {
    const jobDurationData = {
        labels: ['1-3 months', '4-6 months', '7-9 months', '10-12 months', '13-15 months', '15+ months'],
        datasets: [{
            data: durationArr,
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };

    const ctx = document.getElementById('job-duration-pie').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: jobDurationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Function to create the bar chart (jobs per month)
function createBarChart(jobs) {
    // Group jobs by month-year
    const monthlyCounts = {};
    
    jobs.forEach(job => {
        if (!job.createdAt) return;
        
        const date = new Date(job.createdAt);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyCounts).sort();
    const labels = sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return `${new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' })} ${year}`;
    });
    const data = sortedMonths.map(month => monthlyCounts[month]);

    // Create the bar chart
    const ctx = document.getElementById('job-rate-bar').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jobs Posted',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4, // Rounded corners for bars
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Jobs',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} job${context.parsed.y !== 1 ? 's' : ''}`;
                        }
                    }
                }
            }
        }
    });
}

async function fetchJobs() {
    try {
        const userid = sessionStorage.getItem('firebaseId');
        const response = await fetch(`${baseURL}/job/all-jobs/${userid}`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const jobs = await response.json();
        return jobs;
    } catch (error) {
        console.error('Error loading jobs:', error);
        return [];
    }
}

function setActiveLink(activeId) {
    const navLinks = document.querySelectorAll('nav li');
    navLinks.forEach(link => {
        link.classList.remove('bg-blue-800', 'rounded', 'px-2', 'py-1');
    });
    const activeLink = document.getElementById(activeId);
    activeLink.classList.add('bg-blue-800', 'rounded', 'px-2', 'py-1');
}

document.getElementById('view_jobs').addEventListener('click', (event) => {
    event.preventDefault();
    setActiveLink('view_jobs');
    fetchJobs();
});