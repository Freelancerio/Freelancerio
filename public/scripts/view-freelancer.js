function createFreelancerItem(freelancer) {
    //const freelancerList = document.querySelector('.freelancer-list');
    const freelancerList = document.getElementById("display-section");
    
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
   
  
    // Assemble Article
    article.appendChild(header);
    article.appendChild(dl);
 
  
    freelancerList.appendChild(article);
  }
  
  async function fetchFreelancers() {
    document.getElementById('client-page-heading').textContent = "View Freelancers";
    try {
      const userid = sessionStorage.getItem('firebaseId');
      const response = await fetch(`http://localhost:3000/auth/get-users`); 
  
      if (!response.ok) throw new Error('Failed to fetch freelancers');
  
      const freelancers = await response.json();
      document.getElementById("display-section").innerHTML = '';
      freelancers.forEach(createFreelancerItem);
    } catch (error) {
      console.error('Error loading freelancers:', error);
    }
  }

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
    
  
  document.getElementById('view_freelancers').addEventListener('click', (event) => {
    event.preventDefault();
    setActiveLink('view_freelancers');
    fetchFreelancers();
  });

  document.getElementById('post_job').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default link navigation behavior
    setActiveLink('post_job'); // Change the active link color
  });

  if (typeof module !== 'undefined') {
    module.exports = { createFreelancerItem };
  }
  

  
