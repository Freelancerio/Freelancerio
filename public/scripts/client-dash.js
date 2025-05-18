import getBaseUrl from './base-url.mjs';
const baseURL = getBaseUrl();

document.addEventListener('DOMContentLoaded', async function() {
    
    //const userId = sessionStorage.getItem('firebaseId');
    const jobs = await fetchJobs();
    console.log(jobs);
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
    const jobDurationData = {
      labels: ['1-3 months', '4-6 months', '7-9 months', '10-12 months', '13-15 months', '15+ months'],
      datasets: [{
        data: /*[12, 19, 8, 5, 3, 7]*/ durationArr, // Sample counts for each category
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
  
    // Get the canvas element
    const ctx = document.getElementById('job-duration-pie').getContext('2d');
  
    // Create the pie chart
    const jobDurationChart = new Chart(ctx, {
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
  
    // Here you would typically fetch real data from your backend
    // fetchJobDurationData();
    
    // Example function to fetch real data
    /*
    async function fetchJobDurationData() {
      try {
        const response = await fetch('/api/job-duration-stats');
        const data = await response.json();
        
        // Update chart with real data
        jobDurationChart.data.datasets[0].data = data.counts;
        jobDurationChart.update();
      } catch (error) {
        console.error('Error fetching job duration data:', error);
      }
    }
    */
    const activeJobs = document.getElementById("actJobs");
    activeJobs.innerHTML = `<p class="text-lg font-semibold mb-2" id = "actJobs">🟢 Active Jobs: ${durationArr.length}</p>`
  });
  
  

  async function fetchJobs() {
    //document.getElementById('client-page-heading').textContent = "Job Post History";
    try {
    const userid = sessionStorage.getItem('firebaseId');
      const response = await fetch(`${baseURL}/job/all-jobs/${userid}`); // Replace with your actual endpoint
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const jobs = await response.json();
      return jobs;
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  function setActiveLink(activeId) {
    // Remove active classes from all links
    const navLinks = document.querySelectorAll('nav li');
    navLinks.forEach(link => {
      link.classList.remove('bg-blue-800', 'rounded', 'px-2', 'py-1');
    });
  
    // Add active classes to the clicked link
    const activeLink = document.getElementById(activeId);
    activeLink.classList.add('bg-blue-800', 'rounded', 'px-2', 'py-1');
  }

document.getElementById('view_jobs').addEventListener('click', (event) => {
    event.preventDefault();
    setActiveLink('view_jobs');
    fetchJobs();
});