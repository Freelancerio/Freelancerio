document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');

    if (!jobId) {
      document.body.innerHTML = '<p>Job ID not found.</p>';
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/job/single-job/${jobId}`); // Adjust to your actual endpoint
      if (!response.ok) throw new Error('Failed to fetch job details');
      const job = await response.json();

      // Render job details on the page (you can use a similar pattern as createJobItem or customize it)
      document.getElementById('job-title').textContent = job.job_title;
      document.getElementById('company-name').textContent = job.company;
      document.getElementById('job-description').textContent = job.job_description;
      // Add more fields as needed
    } catch (error) {
      console.error('Error fetching job details:', error);
      document.body.innerHTML = '<p>Error loading job details.</p>';
    }
  });