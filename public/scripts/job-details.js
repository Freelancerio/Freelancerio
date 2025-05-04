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

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('id');

  if (!jobId) {
    document.body.innerHTML = '<p>Job ID not found.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/job/single-job/${jobId}`);
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
    document.getElementById('apply-button').addEventListener('click', async () => {
      //window.location.href = `/public/pages/single-job-post.html`; // Adjust the apply link as necessary
      console.log('What is happening');
      const userId = sessionStorage.getItem('firebaseId');
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get('id');
      console.log(`job id: ${jobId}`);
      const getResponse = await fetch(`http://localhost:3000/job/get-client-id/${jobId}`);
      const clientId =  await getResponse.json();
      console.log(`client id: ${clientId}`);
      try{
        const response = await fetch('http://localhost:3000/apply/job-apply',{
          method: "POST",
          headers: {'Content-Type' : 'application/json'},
          body : JSON.stringify({
            client_id : clientId ,
            user_id : userId,
            job_id : jobId
          })});
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Server Error: ${response.statusText}`);
        }
        //window.location.href = "/freelancer-home";
        alert("Successfully Applied");
      }
      catch(error){
        console.error("Job application failed:", error);
        alert(err.message || "There was an error posting the job application. Please try again.");
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