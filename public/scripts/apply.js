document.addEventListener('DOMContentLoaded', async () => {
    // Get job ID from URL
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('jobId');
    
    if (!jobId) {
      alert('Job ID not found. Redirecting to job listings.');
      window.location.href = '/freelancer-home';
      return;
    }
    
    // Set job ID in hidden form field
    document.getElementById('job-id').value = jobId;
    
    // Check if user is logged in (implement your auth check here)
    const userToken = localStorage.getItem('user_token');
    const userData = localStorage.getItem('user_data');
    
    if (!userToken) {
      // Redirect to login if not logged in
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/login.html?redirect=${returnUrl}`;
      return;
    }
    
    // Pre-fill form with user data if available
    if (userData) {
      try {
        const user = JSON.parse(userData);
        document.getElementById('full-name').value = user.fullName || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Fetch job details
    try {
      const response = await fetch(`http://localhost:3000/job/single-job/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job details');
      const job = await response.json();
      
      // Populate job details
      document.getElementById('job-title-text').textContent = job.job_title;
      document.getElementById('company-name-text').textContent = job.company;
      document.getElementById('job-category').textContent = job.job_category;
      document.getElementById('total-pay').textContent = job.total_pay;
      document.getElementById('suggested-rate').textContent = job.total_pay;
      document.getElementById('expected-rate').value = job.total_pay;
      
      // Parse and display skills
      const skillsContainer = document.getElementById('skills-container');
      const skills = getSkills(job.job_requirements);
      
      skills.forEach(skill => {
        const tag = document.createElement('div');
        tag.classList.add('skill-tag');
        tag.textContent = skill;
        tag.dataset.skill = skill;
        tag.addEventListener('click', toggleSkill);
        skillsContainer.appendChild(tag);
      });
      
    } catch (error) {
      console.error('Error fetching job details:', error);
      alert('Error loading job details. Please try again later.');
    }
    
    // Handle form submission
    const applicationForm = document.getElementById('application-form');
    applicationForm.addEventListener('submit', handleSubmit);
    
    // Set up modal close button
    document.getElementById('close-modal').addEventListener('click', () => {
      document.getElementById('success-modal').classList.add('hidden');
      window.location.href = '/freelancer-home';
    });
  });
  
  // Helper functions
  function getSkills(skillsString) {
    if (!skillsString || typeof skillsString !== 'string') return [];
    return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }
  
  function toggleSkill(event) {
    event.target.classList.toggle('selected');
  }
  
  async function handleSubmit(event) {
    event.preventDefault();
    
    try {
      // Disable submit button to prevent double submissions
      const submitButton = document.getElementById('submit-application');
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
      
      // Get form data
      const formData = new FormData(event.target);
      
      // Get selected skills
      const selectedSkills = [];
      document.querySelectorAll('.skill-tag.selected').forEach(el => {
        selectedSkills.push(el.dataset.skill);
      });
      
      // Add selected skills to form data
      formData.append('selectedSkills', JSON.stringify(selectedSkills));
      
      // In a real application, you would send this to your backend
      // For example:
      // const response = await fetch('http://localhost:3000/applications/submit', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('user_token')}`
      //   }
      // });
      
      // if (!response.ok) throw new Error('Failed to submit application');
      
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success modal
      document.getElementById('success-modal').classList.remove('hidden');
      
      // Log application data (remove in production)
      console.log('Application submitted:', {
        jobId: formData.get('jobId'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        coverLetter: formData.get('coverLetter'),
        resume: formData.get('resume').name,
        additionalSkills: formData.get('additionalSkills'),
        expectedRate: formData.get('expectedRate'),
        selectedSkills
      });
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('An error occurred while submitting your application. Please try again later.');
      
      // Re-enable submit button
      const submitButton = document.getElementById('submit-application');
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Application';
    }
  }