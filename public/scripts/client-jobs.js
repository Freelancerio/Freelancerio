function createJobItem(job) {
    //const jobList = document.querySelector('.job-list');
    const jobList = document.getElementById("display-section");
  
    const article = document.createElement('article');
    article.classList.add('job');


    // 👉 Add click event to redirect to job details page
    article.addEventListener('click', async () => {
      await showJobDetails(job._id);
    });

    // Header
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

    // Job Details
    const dl = document.createElement('dl');
    dl.classList.add('job-details');
  
    const details = [
      { label: 'Location', value: "South Africa", iconClass: 'icon-location' },
      { label: 'Rate', value: job.total_pay, iconClass: 'icon-rate' },
      { label: 'Duration', value: "1 Year", iconClass: 'icon-duration' },
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
      dl.appendChild(dd);
    });
  
    // Description
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
  }

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
      const response = await fetch(`http://localhost:3000/job/all-jobs/${userid}`); // Replace with your actual endpoint
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const jobs = await response.json();
      
      document.getElementById("display-section").innerHTML = '';
      jobs.forEach(createJobItem);
    } catch (error) {
      console.error('Error loading jobs:', error);
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
    
  // Attach event listeners here
  document.getElementById('view_jobs').addEventListener('click', (event) => {
    event.preventDefault();
    setActiveLink('view_jobs');
    fetchJobs();
  });



  async function showJobDetails(jobId) {
    const displaySection = document.getElementById('display-section');
    // Clear any previous content in displaySection
    while (displaySection.firstChild) {
        displaySection.removeChild(displaySection.firstChild);
    }

    try {
        const response = await fetch(`http://localhost:3000/job/single-job/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');

        const job = await response.json();

        // Create and append job details section
        const jobDetailsSection = document.createElement('section');
        jobDetailsSection.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'mb-4');

        // Create the grid for job details
        const jobDetailsGrid = document.createElement('div');
        jobDetailsGrid.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-6');

        // Category
        const category = document.createElement('p');
        category.classList.add('text-gray-700');
        category.innerHTML = `<strong>Category:</strong> <span class="font-medium">${job.job_category}</span>`;

        // Rate
        const rate = document.createElement('p');
        rate.classList.add('text-gray-700');
        rate.innerHTML = `<strong>Rate:</strong> R<span class="font-medium">${job.total_pay}</span>`;

        // Status
        const status = document.createElement('p');
        status.classList.add('text-gray-700');
        status.innerHTML = `<strong>Status:</strong> <span class="font-medium">${job.taken_status ? 'Taken' : 'Open'}</span>`;

        // Posted On
        const postedOn = document.createElement('p');
        postedOn.classList.add('text-gray-700');
        postedOn.innerHTML = `<strong>Posted On:</strong> <span class="font-medium">${new Date(job.createdAt).toLocaleDateString()}</span>`;

        // Location
        const location = document.createElement('p');
        location.classList.add('text-gray-700');
        location.innerHTML = `<strong>Location:</strong> South Africa`;

        // Duration
        const duration = document.createElement('p');
        duration.classList.add('text-gray-700');
        duration.innerHTML = `<strong>Duration:</strong> 1 Year`;

        jobDetailsGrid.appendChild(category);
        jobDetailsGrid.appendChild(rate);
        jobDetailsGrid.appendChild(status);
        jobDetailsGrid.appendChild(postedOn);
        jobDetailsGrid.appendChild(location);
        jobDetailsGrid.appendChild(duration);

        jobDetailsSection.appendChild(jobDetailsGrid);

        // Create and append job description section
        const jobDescriptionSection = document.createElement('section');
        jobDescriptionSection.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'mb-4');

        const descriptionHeading = document.createElement('h2');
        descriptionHeading.classList.add('text-2xl', 'font-semibold', 'text-gray-900', 'mb-4');
        descriptionHeading.textContent = 'Job Description';

        const jobDescription = document.createElement('p');
        jobDescription.classList.add('text-gray-700');
        jobDescription.textContent = job.job_description;

        jobDescriptionSection.appendChild(descriptionHeading);
        jobDescriptionSection.appendChild(jobDescription);

        // Create and append required skills section
        const skillsSection = document.createElement('section');
        skillsSection.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'mb-4');

        const skillsHeading = document.createElement('h2');
        skillsHeading.classList.add('text-2xl', 'font-semibold', 'text-gray-900', 'mb-4');
        skillsHeading.textContent = 'Required Skills';

        const skillsContainer = document.createElement('div');
        skillsContainer.classList.add('flex', 'flex-wrap', 'gap-2');

        const skills = job.job_requirements.split(',').map(skill => skill.trim());
        skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.classList.add('bg-gray-200', 'text-gray-800', 'py-1', 'px-4', 'rounded-lg', 'text-sm');
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });

        skillsSection.appendChild(skillsHeading);
        skillsSection.appendChild(skillsContainer);

        // Create button section
        const buttonSection = document.createElement('section');

        //create the back button
        const backButton = document.createElement('button');
        backButton.classList.add('inline-block', 'bg-blue-600', 'text-white', 'px-6', 'py-2', 'rounded-lg', 'hover:bg-blue-700', 'transition', 'duration-300', 'w-full', 'sm:w-auto', 'ml-4');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', () => {
            // i want to be redirected to the previous page
            fetchJobs();
        });

        buttonSection.appendChild(backButton);
  
        // create the edit button
        const editButton = document.createElement('button');
        editButton.classList.add('inline-block', 'bg-green-600', 'text-white', 'px-6', 'py-2', 'rounded-lg', 'hover:bg-green-700', 'transition', 'duration-300', 'w-full', 'sm:w-auto', 'ml-4');
        editButton.textContent = 'Edit Post';

        editButton.addEventListener('click', () => {
            alert('You have applied for this job!');
        });

        buttonSection.appendChild(editButton);

        //create the hide button
        const hideButton = document.createElement('button');
        hideButton.classList.add('inline-block', 'bg-yellow-600', 'text-white', 'px-6', 'py-2', 'rounded-lg', 'hover:bg-yellow-700', 'transition', 'duration-300', 'w-full', 'sm:w-auto', 'ml-4');
        if(job.isHidden === false){
          hideButton.textContent = 'Hide Post';
        }else{
          hideButton.textContent = 'unHide Post';
        }
        

        hideButton.addEventListener('click', () => {
            createHideConfirmationModal(jobId);
        });

        buttonSection.appendChild(hideButton);

      
        // create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('inline-block', 'bg-red-600', 'text-white', 'px-6', 'py-2', 'rounded-lg', 'hover:bg-red-700', 'transition', 'duration-300', 'w-full', 'sm:w-auto', 'ml-4');
        deleteButton.textContent = 'Delete Post';

        deleteButton.addEventListener('click', () => {
            createDeleteConfirmationModal(jobId);
        });

        buttonSection.appendChild(deleteButton);


        // Append everything to display-section
        displaySection.appendChild(jobDetailsSection);
        displaySection.appendChild(jobDescriptionSection);
        displaySection.appendChild(skillsSection);
        displaySection.appendChild(buttonSection);
        
    } catch (error) {
        console.error('Error fetching job details:', error);
        displaySection.innerHTML = '<p>Error loading job details.</p>';
    }
}

function createDeleteConfirmationModal(job_id) {
  const modal = document.createElement('div');
  modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');

  const modalContent = document.createElement('div');
  modalContent.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'w-full', 'sm:w-96');

  const modalHeader = document.createElement('h2');
  modalHeader.textContent = `Are you sure you want to delete this post?`;
  modalHeader.classList.add('text-xl', 'font-semibold', 'mb-4');

  const modalButtons = document.createElement('div');
  modalButtons.classList.add('flex', 'justify-end', 'space-x-4');

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.classList.add('bg-gray-400', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-500', 'transition', 'duration-300');

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Yes, Delete';
  confirmButton.classList.add('bg-red-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-red-700', 'transition', 'duration-300');

  modalButtons.appendChild(cancelButton);
  modalButtons.appendChild(confirmButton);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalButtons);
  modal.appendChild(modalContent);

  cancelButton.addEventListener('click', () => {
    modal.remove(); // Remove modal from DOM
  });

  confirmButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`http://localhost:3000/job/remove-job/${job_id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete job');

      alert(`Post with ID ${job_id} has been deleted!`);
      modal.remove();
      fetchJobs(); // Refresh the job list or redirect, as needed
    } catch (error) {
      alert('Error deleting job: ' + error.message);
    }
  });

  document.body.appendChild(modal);
}



function createHideConfirmationModal(job_id) {
  const modal = document.createElement('div');
  modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');

  const modalContent = document.createElement('div');
  modalContent.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'w-full', 'sm:w-96');

  const modalHeader = document.createElement('h2');
  modalHeader.textContent = `Are you sure you want to hide this post?`;
  modalHeader.classList.add('text-xl', 'font-semibold', 'mb-4');

  const modalButtons = document.createElement('div');
  modalButtons.classList.add('flex', 'justify-end', 'space-x-4');

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.classList.add('bg-gray-400', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-500', 'transition', 'duration-300');

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Yes, Hide';
  confirmButton.classList.add('bg-red-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-red-700', 'transition', 'duration-300');

  modalButtons.appendChild(cancelButton);
  modalButtons.appendChild(confirmButton);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalButtons);
  modal.appendChild(modalContent);

  cancelButton.addEventListener('click', () => {
    modal.remove(); // Remove modal from DOM
  });

  confirmButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`http://localhost:3000/job/set-hidden-status/${job_id}`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to hide job');

      alert(`Post with ID ${job_id} has been hidden!`);
      modal.remove();
    } catch (error) {
      alert('Error hiding job: ' + error.message);
    }
  });

  document.body.appendChild(modal);
}
 
