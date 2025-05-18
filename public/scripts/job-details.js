import getBaseUrl from './base-url.mjs';
const baseURL = getBaseUrl();

const getSkills = (skillsString) => {
  if (!skillsString || typeof skillsString !== 'string') return [];
  return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

// Function to check if user has already applied for this job
const checkApplicationStatus = async (userId, jobId) => {
  try {
    const response = await fetch(`${baseURL}/apply/check-status/${userId}/${jobId}`);

    if (!response.ok) {
      throw new Error(`Error checking application status: ${response.status}`);
    }

    const data = await response.json();

    // If application exists, store in localStorage as backup
    if (data.hasApplied) {
      localStorage.setItem(`applied_${userId}_${jobId}`, 'true');
    }

    return data.hasApplied;
  } catch (error) {
    console.error('Error checking application status:', error);

    // Check localStorage as fallback
    const appliedFromStorage = localStorage.getItem(`applied_${userId}_${jobId}`);
    return appliedFromStorage === 'true';
  }
};

// Function to disable the apply button
const disableApplyButton = () => {
  const applyButton = document.getElementById('apply-button');
  applyButton.disabled = true;
  applyButton.classList.remove('bg-green-600', 'hover:bg-green-700');
  applyButton.classList.add('bg-gray-400', 'cursor-not-allowed');
  applyButton.textContent = 'Applied';
};

// Function to show success modal
const showSuccessModal = () => {
  const modal = document.getElementById('success-modal');
  modal.style.display = 'flex';

  // Add event listener to the OK button
  document.getElementById('modal-ok-button').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Also close modal when clicking outside
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id');
  const userId = sessionStorage.getItem('firebaseId');

  if (!jobId) {
    document.body.innerHTML = '<p>Job ID not found.</p>';
    return;
  }

  try {
    // Always check application status on page load if user is logged in
    if (userId) {
      try {
        const hasApplied = await checkApplicationStatus(userId, jobId);
        if (hasApplied) {
          disableApplyButton();
        }
      } catch (error) {
        console.error('Error checking application status:', error);
        // Fallback to localStorage if API call fails
        const appliedFromStorage = localStorage.getItem(`applied_${userId}_${jobId}`);
        if (appliedFromStorage === 'true') {
          disableApplyButton();
        }
      }
    }

    const response = await fetch(`${baseURL}/job/single-job/${jobId}`);
    if (!response.ok) throw new Error('Failed to fetch job details');
    const job = await response.json();

    // Populate fields
    document.getElementById('job-title').textContent = job.job_title;
    document.getElementById('company-name').textContent = `Company: ${job.company}`;
    document.getElementById('job-category').textContent = job.job_category;
    document.getElementById('total-pay').textContent = job.total_pay;
    document.getElementById('taken-status').textContent = job.taken_status ? 'Taken' : 'Open';
    document.getElementById('created-at').textContent = formatDate(job.createdAt);
    document.getElementById('job-description').textContent = job.job_description;
    document.getElementById('location-category').textContent = job.location_category;
    document.getElementById('duration-months').textContent = job.duration_months;

    const skillsContainer = document.getElementById('skills');
    const skills = getSkills(job.job_requirements);
    skills.forEach(skill => {
      const tag = document.createElement('span');
      tag.classList.add('bg-gray-200', 'text-gray-800', 'py-1', 'px-4', 'rounded-lg', 'text-sm');
      tag.textContent = skill;
      skillsContainer.appendChild(tag);
    });

    // Apply button action
    document.getElementById('apply-button').addEventListener('click', async (event) => {
      // Prevent the click if already applied
      if (event.target.disabled) {
        return;
      }

      // Disable the button immediately to prevent multiple clicks
      const applyButton = event.target;
      applyButton.disabled = true;
      applyButton.classList.remove('bg-green-600', 'hover:bg-green-700');
      applyButton.classList.add('bg-gray-400', 'cursor-not-allowed');
      applyButton.textContent = 'Applying...';

      if (!userId) {
        alert("Please login to apply for this job");
        applyButton.disabled = false;
        applyButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
        applyButton.classList.add('bg-green-600', 'hover:bg-green-700');
        applyButton.textContent = 'Apply Now';
        return;
      }

      // Double-check if already applied before making the request
      try {
        const alreadyApplied = await checkApplicationStatus(userId, jobId);
        if (alreadyApplied) {
          disableApplyButton();
          showSuccessModal();
          return;
        }
      } catch (error) {
        console.log('Error checking application status before applying:', error);
        // Continue with application attempt
      }

      try {
        const getResponse = await fetch(`${baseURL}/job/get-client-id/${jobId}`);
        const clientId = await getResponse.json();

        const response = await fetch(`${baseURL}/apply/job-apply`, {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            client_id: clientId,
            user_id: userId,
            job_id: jobId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server Error: ${response.statusText}`);
        }

        // Successfully applied
        showSuccessModal();
        disableApplyButton();

        // Store in localStorage that user has applied to this job
        localStorage.setItem(`applied_${userId}_${jobId}`, 'true');
      } catch (error) {
        console.error("Job application failed:", error);

        if (error.message === 'You have already applied for this job') {
          disableApplyButton();
          showSuccessModal();
        } else {
          alert(error.message || "There was an error posting the job application. Please try again.");

          // Re-enable the button if there was an error
          applyButton.disabled = false;
          applyButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
          applyButton.classList.add('bg-green-600', 'hover:bg-green-700');
          applyButton.textContent = 'Apply Now';
        }
      }
    });

    // Add event listener for ESC key to close modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modal = document.getElementById('success-modal');
        if (modal.style.display === 'flex') {
          modal.style.display = 'none';
        }
      }
    });

  } catch (error) {
    console.error('Error fetching job details:', error);
    document.body.innerHTML = '<p>Error loading job details.</p>';
  }
});

// Export only for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { /* optionally list functions if needed */ };
}