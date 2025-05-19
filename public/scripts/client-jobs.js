import getBaseUrl from './base-url.mjs';

const baseURL = getBaseUrl();

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
      { label: 'Location', value: job.location_category, iconClass: 'icon-location' },
      { label: 'Rate', value: job.total_pay, iconClass: 'icon-rate' },
      { label: 'Duration', value: `${job.duration_months} Months`, iconClass: 'icon-duration' },
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
      const response = await fetch(`${baseURL}/job/all-jobs/${userid}`); // Replace with your actual endpoint
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
    document.getElementById('client-page-heading').textContent = "Job Post Details";
    // Clear any previous content in displaySection
    while (displaySection.firstChild) {
        displaySection.removeChild(displaySection.firstChild);
    }

    try {
        const response = await fetch(`${baseURL}/job/single-job/${jobId}`);
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
        location.innerHTML = `<strong>Location:</strong> ${job.location_category}`;

        // Duration
        const duration = document.createElement('p');
        duration.classList.add('text-gray-700');
        duration.innerHTML = `<strong>Duration:</strong> ${job.duration_months} Months`;

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
            editJobPosting(job, jobId);
        });

        buttonSection.appendChild(editButton);


        // create the view applications button
        const applicationsButton = document.createElement('button');
        applicationsButton.classList.add('inline-block', 'bg-teal-600', 'text-white', 'px-6', 'py-2', 'rounded-lg', 'hover:bg-teal-700', 'transition', 'duration-300', 'w-full', 'sm:w-auto', 'ml-4');
        applicationsButton.textContent = 'View Applications';

        applicationsButton.addEventListener('click', () => {
            viewApplications(jobId);
        });

        buttonSection.appendChild(applicationsButton);

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

        //create make payment button
        const payButton = document.createElement('button');
        payButton.textContent = 'Make Payment';
        payButton.classList.add(
        'inline-block', 'bg-purple-600', 'text-white',
  'px-6', 'py-2', 'rounded-lg', 'hover:bg-purple-700',
  'transition', 'duration-300', 'w-full', 'sm:w-auto', 'ml-4'
);

payButton.addEventListener('click', async () => {
  try {
    const res = await fetch(`${baseURL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_title: job.job_title,
        total_pay: job.total_pay
      })
    });
    const { url } = await res.json();
    window.location.href = url; // Redirect to Stripe Checkout
  } catch (err) {
    alert('Failed to redirect to payment page: ' + err.message);
  }
});

buttonSection.appendChild(payButton);


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
      const response = await fetch(`${baseURL}/job/remove-job/${job_id}`, {
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
  modalHeader.textContent = `Are you sure you want to hide/unhide this post?`;
  modalHeader.classList.add('text-xl', 'font-semibold', 'mb-4');

  const modalButtons = document.createElement('div');
  modalButtons.classList.add('flex', 'justify-end', 'space-x-4');

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.classList.add('bg-gray-400', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-gray-500', 'transition', 'duration-300');

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Yes, Hide/unHide';
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
      const response = await fetch(`${baseURL}/job/set-hidden-status/${job_id}`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to hide/unHide job');

      alert(`Post with ID ${job_id} has been hidden/unhidden!`);
      modal.remove();
    } catch (error) {
      alert('Error hiding/unhiding job: ' + error.message);
    }
  });

  document.body.appendChild(modal);
}
 


function editJobPosting(job, job_id) {
  // Modal overlay
  const modal = document.createElement('section');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';

  // Modal content wrapper
  const modalContent = document.createElement('section');
  modalContent.className = 'bg-white p-8 rounded shadow-md max-w-4xl w-full relative overflow-y-auto max-h-[90vh]';

  // Close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.className = 'absolute top-2 right-4 text-2xl text-gray-600 hover:text-gray-800';
  closeButton.addEventListener('click', () => modal.remove());
  modalContent.appendChild(closeButton);

  // Article container
  const article = document.createElement('article');
  article.className = 'bg-white';

  // Helper to create labeled fields
  function createField(labelText, inputElement, required = true) {
    const section = document.createElement('section');
    section.className = 'mb-4';

    const label = document.createElement('label');
    label.className = 'block text-gray-700 font-semibold mb-2';
    label.textContent = labelText;
    label.htmlFor = inputElement.id;

    if (required) inputElement.required = true;

    section.appendChild(label);
    section.appendChild(inputElement);
    return section;
  }

  // Job Title
  const jobTitleInput = document.createElement('input');
  jobTitleInput.type = 'text';
  jobTitleInput.id = 'jobTitle';
  jobTitleInput.name = 'job_title';
  jobTitleInput.placeholder = 'e.g. UI/UX Designer';
  jobTitleInput.className = 'w-full border border-gray-300 p-2 rounded';
  jobTitleInput.value = job.job_title || '';
  article.appendChild(createField('Job Title*', jobTitleInput));

  // Job Description
  const jobDescriptionTextarea = document.createElement('textarea');
  jobDescriptionTextarea.id = 'jobDescription';
  jobDescriptionTextarea.name = 'job_description';
  jobDescriptionTextarea.placeholder = 'Describe the job...';
  jobDescriptionTextarea.className = 'w-full border border-gray-300 p-2 rounded';
  jobDescriptionTextarea.value = job.job_description || '';
  article.appendChild(createField('Job Description*', jobDescriptionTextarea));

  // Job Requirements
  const jobRequirementsTextarea = document.createElement('textarea');
  jobRequirementsTextarea.id = 'jobRequirements';
  jobRequirementsTextarea.name = 'job_requirements';
  jobRequirementsTextarea.placeholder = 'List required skills, separated by commas';
  jobRequirementsTextarea.className = 'w-full border border-gray-300 p-2 rounded';
  jobRequirementsTextarea.value = job.job_requirements || '';
  article.appendChild(createField('Job Requirements*', jobRequirementsTextarea));

  // Job Category Select
  const jobCategorySelect = document.createElement('select');
  jobCategorySelect.id = 'jobCategory';
  jobCategorySelect.name = 'job_category';
  jobCategorySelect.className = 'w-full border border-gray-300 p-2 rounded';
  const categories = ['IT', 'Marketing', 'Finance', 'Design', 'Education', 'Healthcare', 'Construction', 'Other'];
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select a category';
  jobCategorySelect.appendChild(defaultOption);
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (job.job_category === cat) opt.selected = true;
    jobCategorySelect.appendChild(opt);
  });
  article.appendChild(createField('Job Category*', jobCategorySelect));

  // Location Select
  const locationCategorySelect = document.createElement('select');
  locationCategorySelect.id = 'locationCategory';
  locationCategorySelect.name = 'location_category';
  locationCategorySelect.className = 'w-full border border-gray-300 p-2 rounded';
  const location_categories = ['Gauteng', 'Limpopo', 'Mpumalanga', 'North West', 'KwaZulu-Natal', 'Free State', 'Eastern Cape', 'Northern Cape', 'Western Cape', 'Remote', 'Other'];
  const defaultLoc = document.createElement('option');
  defaultLoc.value = '';
  defaultLoc.textContent = 'Select a category';
  locationCategorySelect.appendChild(defaultLoc);
  location_categories.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    if (job.location_category === loc) opt.selected = true;
    locationCategorySelect.appendChild(opt);
  });
  article.appendChild(createField('Location Category*', locationCategorySelect));

  // Total Pay
  const totalPayInput = document.createElement('input');
  totalPayInput.type = 'number';
  totalPayInput.id = 'totalPay';
  totalPayInput.name = 'total_pay';
  totalPayInput.min = '0';
  totalPayInput.placeholder = 'e.g. 1000';
  totalPayInput.className = 'w-full border border-gray-300 p-2 rounded';
  totalPayInput.value = job.total_pay || '';
  article.appendChild(createField('Total Pay*', totalPayInput));

  // Duration
  const totalDuration = document.createElement('input');
  totalDuration.type = 'number';
  totalDuration.id = 'totalDuration';
  totalDuration.name = 'total_duration';
  totalDuration.min = '0';
  totalDuration.placeholder = 'e.g. 12';
  totalDuration.className = 'w-full border border-gray-300 p-2 rounded';
  totalDuration.value = job.total_duration || 12;
  article.appendChild(createField('Duration in Months*', totalDuration));

  // Submit Button
  const footer = document.createElement('footer');
  const postJobButton = document.createElement('button');
  postJobButton.id = 'updateJobBtn';
  postJobButton.type = 'submit';
  postJobButton.textContent = 'Update Job';
  postJobButton.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded';
  footer.appendChild(postJobButton);
  article.appendChild(footer);

  // Form handling
  postJobButton.addEventListener('click', async (e) => {
    e.preventDefault();
    postJobButton.disabled = true;
    postJobButton.textContent = 'Updating...';

    const data = {
      client_id: job.client_id,
      job_title: jobTitleInput.value.trim(),
      job_description: jobDescriptionTextarea.value.trim(),
      job_requirements: jobRequirementsTextarea.value.trim(),
      job_category: jobCategorySelect.value,
      taken_status:job.taken_status,
      location_category: locationCategorySelect.value,
      total_pay: parseFloat(totalPayInput.value),
      isHidden: job.isHidden,
      duration_months: parseInt(totalDuration.value)
    };

    try {
      const res = await fetch(`${baseURL}/job/update-job/${job_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update job');

      alert('Job updated successfully!');
      modal.remove();
      showJobDetails(job_id)
    } catch (err) {
      alert('Error updating job: ' + err.message);
    } finally {
      postJobButton.disabled = false;
      postJobButton.textContent = 'Update Job';
    }
  });

  modalContent.appendChild(article);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}


async function viewApplications(jobId) {
  const displaySection = document.getElementById("display-section");
  displaySection.innerHTML = ""; // Clear the section

  document.getElementById('client-page-heading').textContent = "Job Applications";

  // Create and append a back button
  const backButton = document.createElement("button");
  backButton.textContent = "← Back to Job Postings";
  backButton.classList.add(
    "mb-4",
    "px-4",
    "py-2",
    "bg-gray-500",
    "text-white",
    "rounded",
    "hover:bg-gray-600",
    "transition"
  );
  backButton.onclick = () => {
    showJobDetails(jobId);
  };
  displaySection.appendChild(backButton);

  try {
    const response = await fetch(`${baseURL}/apply/getApplicants/${jobId}`);
    const applicants = await response.json();

    if (!Array.isArray(applicants) || applicants.length === 0) {
      const noResult = document.createElement("p");
      noResult.textContent = "No applicants found for this job.";
      noResult.classList.add("text-gray-600", "mt-4");
      displaySection.appendChild(noResult);
      return;
    }

    applicants.forEach(app => {
      const card = document.createElement("div");
      card.classList.add(
        "bg-white",
        "shadow-md",
        "rounded-lg",
        "p-6",
        "mb-4",
        "flex",
        "items-center",
        "justify-between"
      );

      const infoContainer = document.createElement("div");
      infoContainer.classList.add("flex", "items-center");

      const img = document.createElement("img");
      img.src = app.user?.photoURL || "https://via.placeholder.com/60";
      img.alt = `${app.user?.name || "Applicant"}'s profile picture`;
      img.classList.add("w-16", "h-16", "rounded-full", "mr-4");

      const details = document.createElement("div");

      const nameLink = document.createElement("a");
      nameLink.href = `#`;  // You can modify this to a specific URL for the profile page
      nameLink.textContent = app.user?.displayName || "No Name";
      nameLink.classList.add("text-lg", "font-semibold", "text-blue-600", "hover:underline");
      nameLink.onclick = (event) => {
        event.preventDefault();  
        viewApplicantProfile(app.user_id,jobId);
      };

      const email = document.createElement("p");
      email.textContent = app.user?.email || "No Email";
      email.classList.add("text-gray-600");

      details.appendChild(nameLink);  // Append the nameLink instead of name
      details.appendChild(email);
      infoContainer.appendChild(img);
      infoContainer.appendChild(details);

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("space-x-2");

      const acceptBtn = document.createElement("button");
      acceptBtn.textContent = "Accept";
      acceptBtn.classList.add(
        "bg-green-600",
        "text-white",
        "px-4",
        "py-2",
        "rounded",
        "hover:bg-green-700",
        "transition"
      );


        // Modal creation
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add(
          "fixed",
          "top-0",
          "left-0",
          "w-full",
          "h-full",
          "bg-black",
          "bg-opacity-50",
          "flex",
          "items-center",
          "justify-center",
          "z-50",
          "hidden"
        );

        const modalBox = document.createElement("div");
        modalBox.classList.add(
          "bg-white",
          "p-6",
          "rounded-lg",
          "w-full",
          "max-w-2xl",
          "shadow-lg"
        )

      // Add content to modal
      modalBox.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Enter Details for Contract with ${app.user?.displayName}</h2>
        <textarea class="w-full h-64 border p-2 rounded mb-4 resize-none" placeholder="Enter your notes here..."></textarea>
        <div class="text-right">
          <button id="confirmModalBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Confirm
          </button>
        </div>
      `;

      modalOverlay.appendChild(modalBox);
      document.body.appendChild(modalOverlay);

      // Show modal on accept
      acceptBtn.onclick = () => {
        modalOverlay.classList.remove("hidden");
      };

      // Handle confirm button
      modalBox.querySelector("#confirmModalBtn").onclick = () => {
        const textareaValue = modalBox.querySelector("textarea").value;
        console.log("Confirmed with text:", textareaValue);
        alert(`Confirmed for ${app.user?.displayName} with message: ${textareaValue}`);
        modalOverlay.classList.add("hidden"); // Close modal
      };

      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "Reject";
      rejectBtn.classList.add(
        "bg-red-600",
        "text-white",
        "px-4",
        "py-2",
        "rounded",
        "hover:bg-red-700",
        "transition"
      );
      // Add reject functionality here
      rejectBtn.onclick = () => alert(`Rejected ${app.user?.displayName}`);

      buttonContainer.appendChild(acceptBtn);
      buttonContainer.appendChild(rejectBtn);

      card.appendChild(infoContainer);
      card.appendChild(buttonContainer);

      displaySection.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to fetch applicants:", error);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "An error occurred while loading applicants.";
    errorMsg.classList.add("text-red-500", "mt-4");
    displaySection.appendChild(errorMsg);
  }
}




const getUserDetails = async (profile_id) => {
  try {
      const response = await fetch(`${baseURL}/auth/get-user/${profile_id}`);
      if (!response.ok) {
          throw new Error('Failed to fetch user details');
      }

      const user = await response.json();

      // Set user details to the page
      document.getElementById("user-name-display").textContent = user.user.displayName || "Unknown User";
      document.getElementById("user-email").textContent = user.user.email|| "No email available";
      document.getElementById("user-profile-picture").src = user.user.photoURL || "https://www.gravatar.com/avatar/default?s=200&d=mp";

      // Fill display section
      document.getElementById("skills-display").textContent = user.user.skills || "No skills listed";
      document.getElementById("about-display").textContent = user.user.about|| "No about information provided";

  } catch (error) {
      console.error("Error fetching user details:", error);
      alert("There was an error fetching your details.");
  }
};




function renderUserProfileTemplate(jobId) {
  const container = document.getElementById("display-section");
  container.innerHTML = ""; // Clear previous content

  // Main article wrapper
  const article = document.createElement("article");
  article.className = "bg-white shadow rounded-xl p-6";

  // Header
  const header = document.createElement("header");
  header.className = "text-center mb-10";

  const figure = document.createElement("figure");
  figure.className = "flex justify-center mb-4";
  const img = document.createElement("img");
  img.id = "user-profile-picture";
  img.src = "";
  img.alt = "Profile picture";
  img.className = "rounded-full w-32 h-32 border-4 border-blue-100 object-cover shadow-md";
  figure.appendChild(img);

  const title = document.createElement("h1");
  title.className = "text-3xl font-bold mb-1 text-gray-900";
  title.textContent = "Your Profile";

  const nameSection = document.createElement("section");
  nameSection.className = "space-y-1";

  const name = document.createElement("h1");
  name.id = "user-name-display";
  name.className = "text-2xl font-semibold text-gray-900";
  name.textContent = "Loading Name...";

  const email = document.createElement("p");
  email.id = "user-email";
  email.className = "text-2xl font-semibold text-gray-900";
  email.textContent = "Loading Email...";

  nameSection.appendChild(name);
  nameSection.appendChild(email);

  header.appendChild(figure);
  header.appendChild(title);
  header.appendChild(nameSection);
  article.appendChild(header);

  // Profile summary
  const summaryWrapper = document.createElement("section");
  summaryWrapper.setAttribute("aria-labelledby", "edit-heading");

  const summaryHeading = document.createElement("h2");
  summaryHeading.id = "edit-heading";
  summaryHeading.className = "text-2xl font-semibold mb-6 text-gray-900 border-b pb-2";
  summaryHeading.textContent = "Profile Summary";
  summaryWrapper.appendChild(summaryHeading);

  const displaySection = document.createElement("section");
  displaySection.id = "profile-display-fields";
  displaySection.className = "space-y-6";

  // About You
  const aboutSection = document.createElement("section");
  const aboutLabel = document.createElement("label");
  aboutLabel.className = "block font-medium text-gray-700 mb-1";
  aboutLabel.textContent = "About You";
  const aboutText = document.createElement("p");
  aboutText.id = "about-display";
  aboutText.className = "bg-gray-100 p-3 rounded-lg";
  aboutText.textContent = "Loading about info...";
  aboutSection.appendChild(aboutLabel);
  aboutSection.appendChild(aboutText);

  // Skills
  const skillsSection = document.createElement("section");
  const skillsLabel = document.createElement("label");
  skillsLabel.className = "block font-medium text-gray-700 mb-1";
  skillsLabel.textContent = "Skills";
  const skillsText = document.createElement("p");
  skillsText.id = "skills-display";
  skillsText.className = "bg-gray-100 p-3 rounded-lg";
  skillsText.textContent = "Loading skills...";
  skillsSection.appendChild(skillsLabel);
  skillsSection.appendChild(skillsText);

  // Work Experience
  const expSection = document.createElement("section");
  const expLabel = document.createElement("label");
  expLabel.className = "block font-medium text-gray-700 mb-1";
  expLabel.textContent = "Work Experience (Read-only)";
  const expText = document.createElement("p");
  expText.id = "experience-display";
  expText.className = "bg-gray-100 p-3 rounded-lg";
  expText.textContent = "Loading work experience...";
  expSection.appendChild(expLabel);
  expSection.appendChild(expText);

  // Edit Button
  const backSection = document.createElement("section");
  backSection.className = "flex justify-end";
  const backBtn = document.createElement("button");
  backBtn.id = "back-btn";
  backBtn.className = "bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition";
  backBtn.innerHTML = '<i class="fas fa-edit mr-2"></i>Back';
  backSection.appendChild(backBtn);

  backBtn.addEventListener('click', () =>{
    viewApplications(jobId);
  })

  // Append all sections
  displaySection.appendChild(aboutSection);
  displaySection.appendChild(skillsSection);
  displaySection.appendChild(expSection);
  displaySection.appendChild(backSection);

  summaryWrapper.appendChild(displaySection);
  article.appendChild(summaryWrapper);

  // Append article to the container
  container.appendChild(article);
}


function viewApplicantProfile(profile_id,jobId){
  renderUserProfileTemplate(jobId);
  getUserDetails(profile_id)

}