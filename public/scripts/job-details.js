document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id');
  let currentJob = null; // Store job data globally for use in apply button

  if (!jobId) {
    document.body.innerHTML = '<p>Job ID not found.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/job/single-job/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch job details');
    const job = await response.json();

    // Store the current job data
    currentJob = job;

    // Render job details on the page
    document.getElementById('job-title').textContent = job.job_title;
    document.getElementById('company-name').textContent = job.company;
    document.getElementById('job-description').textContent = job.job_description;
    // Add more fields as needed

    // Now setup the apply button
    setupApplyButton(job, jobId);

  } catch (error) {
    console.error('Error fetching job details:', error);
    document.body.innerHTML = '<p>Error loading job details.</p>';
  }
});

// Function to setup the apply button with event listener
function setupApplyButton(job, jobId) {
  const applyButton = document.getElementById('apply-button');

  if (!applyButton) {
    console.error('Apply button not found in the DOM');
    return;
  }

  // Add active styling for the button when clicked
  applyButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // Visual feedback - add active class
    applyButton.classList.add('button-active');

    // Get user info from session storage (if needed)
    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');

    if (!userId) {
      alert('Please log in to apply for this job');
      window.location.href = "../index.html"; // Redirect to login page
      return;
    }

    try {
      // Send application to server
      const response = await fetch('http://localhost:3000/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
        },
        body: JSON.stringify({
          jobId: jobId,
          userId: userId,
          // Add any other application details you need
          applicationDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();

      // Show success message
      alert('Application submitted successfully!');

      // Optional: Change button text or disable it
      applyButton.textContent = 'Applied';
      applyButton.disabled = true;

    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error submitting application. Please try again.');

      // Remove active class if there was an error
      applyButton.classList.remove('button-active');
    }
  });
}