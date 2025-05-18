import getBaseUrl from './base-url.mjs';
const baseURL = getBaseUrl();

document.addEventListener('DOMContentLoaded',()=> {
  fetchJobs();  
});


function createJobItem(job){
    const jobList = document.getElementById("jobs-container");
    const article = document.createElement('article');
    article.classList.add('job');

    //Add click event to redirect to job details page
    article.addEventListener('click', async() => {
        await showJobDetails(job._id);
    });

    //Header
    const header = document.createElement('header');
    header.classList.add('job-header');

    const hgroup = document.createElement('hgroup');
    hgroup.classList.add('job-title-group');

    const h2 = document.createElement('h2');
    h2.classList.add('job-title');
    h2.textContent = job.job_title;

    const companyLink = document.createElement('a');
    companyLink.href = '#';
    companyLink.classList.add('company');
    companyLink.textContent = job.company;

    hgroup.appendChild(h2);
    hgroup.appendChild(companyLink);

    header.appendChild(hgroup);
    //Job Details

    const dl = document.createElement('dl');
    dl.classList.add('job-details');

    const details = [
        {label: 'Location', value: job.location_category, iconClass: 'icon-location'},
        {label: 'Rate', value: job.total_pay, iconClass : 'icon-rate'},
        {label: 'Duration',value: `${job.duration_months} Months`, iconClass: 'icon-duration'}
    ];

    details.forEach(detail => {
        const dt = document.createElement('dt');
        dt.textContent = detail.label;
    
        const dd = document.createElement('dd');
        const icon = document.createElement('span');
        icon.classList.add(detail.iconClass);
        icon.setAttribute('aria-hidden', 'true');
        dd.appendChild(icon);
        dd.append(' ' + detail.value);
    
        dl.appendChild(dt);
        dl.appendChild(dd)});

        const desc = document.createElement('p');
    desc.classList.add('job-description');
    desc.textContent = job.job_description;
  
    // Footer (Skills)
    const footer = document.createElement('footer');
  
    const hiddenHeading = document.createElement('h3');
    hiddenHeading.classList.add('visually-hidden');
    hiddenHeading.textContent = 'Required Skills';
    footer.appendChild(hiddenHeading);
  
    const ul = document.createElement('ul');
    ul.classList.add('skill-tags');
    let skills = getSkills(job.job_requirements);   
    skills.forEach(skill => {
      const li = document.createElement('li');
      li.classList.add('skill-tag');
      li.textContent = skill;
      ul.appendChild(li);
    });
  
    footer.appendChild(ul);
  
    // Assemble Article
    article.appendChild(header);
    article.appendChild(dl);
    article.appendChild(desc);
    article.appendChild(footer);
  
    jobList.appendChild(article);

};

const getSkills = (skillsString) => {
    if (!skillsString || typeof skillsString !== 'string') return [];
  
    return skillsString
      .split(',')               // Split by comma
      .map(skill => skill.trim()) // Trim spaces around each skill
      .filter(skill => skill.length > 0); // Remove any empty entries
  };
  
  

  async function fetchJobs() {
    document.getElementById('client-page-heading').textContent = "Job Post History";
    try {
    const userid = sessionStorage.getItem('firebaseId');
      const response = await fetch(`${baseURL}/job/all-jobs/${userid}`); // Replace with your actual endpoint
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const jobs = await response.json();
      
      document.getElementById("display-section").innerHTML = '';
      jobs.forEach(createJobItem);
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