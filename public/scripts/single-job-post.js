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

        const skillsContainer = document.getElementById('skills');
        const skills = getSkills(job.job_requirements);
        skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.classList.add('bg-gray-200', 'text-gray-800', 'py-1', 'px-4', 'rounded-lg', 'text-sm');
            tag.textContent = skill;
            skillsContainer.appendChild(tag);
        });

        // // Apply button action
        // document.getElementById('apply-button').addEventListener('click', () => {
        //   window.location.href = `apply.html?jobId=${job._id}`; // Adjust the apply link as necessary
        // });

        // Updated apply button handler to match the cleaner URL structure
        document.getElementById('apply-button').addEventListener('click', async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const jobId = params.get('id');

                if (!jobId) {
                    alert('Job ID not found. Cannot proceed with application.');
                    return;
                }

                // Visual feedback on button click
                const applyButton = document.getElementById('apply-button');
                applyButton.classList.add('button-active');

                // Check if user is logged in (you can implement actual auth check)
                const isLoggedIn = localStorage.getItem(`user_token`);

                if (!isLoggedIn) {
                    // If not logged in, redirect to login page with return URL
                    const returnUrl = encodeURIComponent(window.location.href);
                    window.location.href = `/?redirect=${returnUrl}`;
                    return;
                }
                console.log("Here is the isLogged const " + isLoggedIn);
                console.log("Here is the jobId const " + jobId);

                // If logged in, redirect to application page with job ID using the cleaner URL structure
                window.location.href = `/apply?jobId=${jobId}`;

            } catch (error) {
                console.error('Error handling application:', error);
                alert('An error occurred while processing your application. Please try again later.');
            }
        });

    } catch (error) {
        console.error('Error fetching job details:', error);
        document.body.innerHTML = '<p>Error loading job details.</p>';
    }
});