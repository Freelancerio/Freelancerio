const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const body = document.body;

sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    body.classList.toggle('sidebar-open');
});

document.addEventListener('click', function (event) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('open') && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        body.classList.remove('sidebar-open');
    }
});

const modal = document.getElementById("postJobModal");

function openModal() {
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.getElementById("jobForm").addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Job posted successfully!");
    closeModal();
});

// Functions for handling View Profile and Review Application buttons
function viewProfile(freelancerId) {
    // Store the freelancer ID in localStorage to retrieve it on the profile page
    localStorage.setItem('currentFreelancer', freelancerId);
    // Navigate to the profile page
    window.location.href = '/freelancer-profile.html';
}

function reviewApplication(freelancerId, jobTitle) {
    // Store the freelancer ID and job title in localStorage
    localStorage.setItem('applicationFreelancer', freelancerId);
    localStorage.setItem('applicationJob', jobTitle);
    // Navigate to the application review page
    window.location.href = '/review-application.html';
}