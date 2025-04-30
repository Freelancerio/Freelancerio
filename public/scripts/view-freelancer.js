function createFreelancerItem(freelancer) {
    const freelancerList = document.querySelector('.freelancer-list');
    freelancerList.style.marginBottom = "10px";

  
    const article = document.createElement('article');
    article.classList.add('freelancer');
    article.classList.add('job');
  
    // 👉 Add click event to redirect to freelancer profile/details page
    article.addEventListener('click', () => {
        singleFreelancer(freelancerId)
    });
  
    // Header
    const header = document.createElement('header');
    header.classList.add('freelancer-header');
  
    const hgroup = document.createElement('hgroup');
    hgroup.classList.add('freelancer-title-group');
  
    const h2 = document.createElement('h2');
    h2.classList.add('freelancer-username');
    h2.textContent = freelancer.username;
  
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:${freelancer.email}`;
    emailLink.classList.add('freelancer-email');
    emailLink.textContent = freelancer.email;
  
    hgroup.appendChild(h2);
    hgroup.appendChild(emailLink);
    header.appendChild(hgroup);
  
    // If you want to add more info later, use this section
    const dl = document.createElement('dl');
    dl.classList.add('freelancer-details');
    // Add more details here if needed
  
    // Article content (optional description/footer if needed)
    // Remove if not used:
    // const desc = document.createElement('p');
    // desc.textContent = freelancer.description || '';
  
    // const footer = document.createElement('footer');
    // footer.textContent = 'More info'; // Customize this
  
    // Assemble Article
    article.appendChild(header);
    article.appendChild(dl);
    // article.appendChild(desc);
    // article.appendChild(footer);
  
    freelancerList.appendChild(article);
  }
  
  async function fetchFreelancers() {
    try {
      const userid = sessionStorage.getItem('firebaseId');
      const response = await fetch(`http://localhost:3000/auth/get-users`); // Update this endpoint name if it's actually fetching freelancers
  
      if (!response.ok) throw new Error('Failed to fetch freelancers');
  
      const freelancers = await response.json();
      freelancers.forEach(createFreelancerItem);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    }
  }
  

  async function singleFreelancer(freelancerId){
    try {
        const response = await fetch(`http://localhost:3000/auth/single-freelancer/${freelancerId}`); // Adjust to your actual endpoint
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
  }

  
  document.addEventListener('DOMContentLoaded', fetchFreelancers());
