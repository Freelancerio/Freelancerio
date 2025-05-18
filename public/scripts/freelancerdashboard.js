// Import utilities
import {checkAuthStatus, getAuthToken} from './auth_utils.js';

// freelancer-dashboard.js - Enhanced dashboard implementation with new user experience

document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state immediately
    showLoadingState('Initializing dashboard...');

    try {
        // Try to render immediately with cached data if available
        const cachedUser = sessionStorage.getItem('currentUser');
        if (cachedUser) {
            const userData = JSON.parse(cachedUser);
            updateUserInfo(userData);
            showLoadingState('Loading your latest data...');
        }

        // Firebase authentication check (will use cache first, then verify)
        const currentUser = await checkAuthStatus();

        if (!currentUser) {
            console.warn('User not authenticated, redirecting to login');
            window.location.href = '/'; // Redirect to login if not authenticated
            return;
        }

        // Start parallel data loading for better performance
        const dataPromises = [
            loadUserProfile(currentUser.uid),
            loadJobApplications(currentUser.uid),
            loadAvailableJobs(),
            loadUserStats(currentUser.uid)
        ];

        // Wait for critical data to load
        const [userProfile] = await Promise.all([dataPromises[0]]);

        // Update UI with user profile data
        updateUserProfileUI(userProfile);

        // Show dashboard content now that essential data is loaded
        document.getElementById('dashboardContent').classList.remove('hidden');
        updateLoadingState('Loading additional data...');

        // Wait for remaining data to load
        try {
            const [_, applications, jobs, stats] = await Promise.all(dataPromises);

            // Check if this is a new user
            const isNewUser = applications.length === 0;

            updateApplicationsUI(applications, isNewUser);
            updateAvailableJobsUI(jobs, isNewUser);
            updateStatsUI(stats, isNewUser);

            // Show onboarding elements for new users
            if (isNewUser) {
                showNewUserOnboarding();
            }

        } catch (error) {
            console.error('Error loading secondary data:', error);
            showErrorMessage('Some dashboard data failed to load. Please refresh to try again.');
        }

        // Setup event listeners for dashboard interactions
        setupEventListeners();

        // Hide loading state completely
        hideLoadingState();

    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showErrorMessage('Failed to initialize dashboard. Please try again.');
        hideLoadingState();
    }
});

/**
 * Show onboarding elements for new users
 */
function showNewUserOnboarding() {
    // Create onboarding container if it doesn't exist
    let onboardingContainer = document.getElementById('newUserOnboarding');

    if (!onboardingContainer) {
        onboardingContainer = document.createElement('div');
        onboardingContainer.id = 'newUserOnboarding';
        onboardingContainer.className = 'bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md shadow-sm dark:bg-blue-900 dark:border-blue-700';

        onboardingContainer.innerHTML = `
            <div class="flex items-center mb-3">
                <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-lg font-medium text-blue-800 dark:text-blue-300">Welcome to your Freelancer Dashboard!</h3>
                </div>
            </div>
            <div class="ml-9">
                <p class="text-blue-700 dark:text-blue-300 mb-2">It looks like you're just getting started. Here are a few things you can do:</p>
                <ul class="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1">
                    <li>Complete your profile to attract clients</li>
                    <li>Browse available jobs and submit your first application</li>
                    <li>Set up payment details to get paid for your work</li>
                </ul>
                <div class="mt-4">
                    <button id="getStartedBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800">
                        Get Started
                    </button>
                    <button id="dismissOnboardingBtn" class="ml-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Dismiss
                    </button>
                </div>
            </div>
        `;

        // Add onboarding section at the top of dashboard content
        const dashboardContent = document.getElementById('dashboardContent');
        dashboardContent.insertBefore(onboardingContainer, dashboardContent.firstChild);

        // Add event listeners
        document.getElementById('getStartedBtn').addEventListener('click', function() {
            window.location.href = '/edit-profile.html';
        });

        document.getElementById('dismissOnboardingBtn').addEventListener('click', function() {
            onboardingContainer.remove();
            localStorage.setItem('onboardingDismissed', 'true');
        });
    }
}

/**
 * Load user profile data from the backend
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
async function loadUserProfile(userId) {
    try {
        const token = await getAuthToken();

        if (!token) {
            throw new Error('Authentication token not available');
        }

        const response = await fetch(`/api/users/${userId}/details`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Cache user profile for faster loading next time
        localStorage.setItem('userProfile', JSON.stringify(data.user));

        // Check if profile is incomplete and mark as new user
        const isProfileIncomplete = !data.user.about || !data.user.skills || data.user.skills.trim() === '';
        if (isProfileIncomplete) {
            localStorage.setItem('isNewUser', 'true');
        }

        return data.user;
    } catch (error) {
        console.error('Error loading user profile:', error);

        // Try to use cached profile if available
        const cachedProfile = localStorage.getItem('userProfile');
        if (cachedProfile) {
            return JSON.parse(cachedProfile);
        }

        // Return basic profile if no cache
        return {
            about: '',
            skills: '',
            displayName: 'User',
            email: '',
            photoURL: '',
            isNewUser: true
        };
    }
}

/**
 * Load user job applications
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of user applications
 */
async function loadJobApplications(userId) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`/api/applications/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading applications:', error);
        return [];
    }
}

/**
 * Load available jobs
 * @returns {Promise<Array>} List of available jobs
 */
async function loadAvailableJobs() {
    try {
        const response = await fetch('/api/jobs/all');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading jobs:', error);
        return [];
    }
}

/**
 * Load user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
async function loadUserStats(userId) {
    try {
        const token = await getAuthToken();

        const response = await fetch(`/api/applications/user/${userId}/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error loading user stats:', error);
        return {
            totalApplications: 0,
            acceptedApplications: 0,
            pendingApplications: 0,
            rejectedApplications: 0,
            successRate: 0
        };
    }
}

/**
 * Update the UI with user profile information
 * @param {Object} profile - User profile data
 */
function updateUserProfileUI(profile) {
    if (!profile) return;

    // Update greeting with user's name
    const greetingEl = document.getElementById('userGreeting');
    if (greetingEl && profile.displayName) {
        greetingEl.textContent = `Welcome back, ${profile.displayName}!`;
    }

    // Update user avatar
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl && profile.photoURL) {
        avatarEl.src = profile.photoURL;
        avatarEl.alt = profile.displayName || 'User';
    }

    // Update about section if available
    const aboutEl = document.getElementById('userAbout');
    if (aboutEl) {
        if (profile.about) {
            aboutEl.textContent = profile.about;
        } else {
            aboutEl.innerHTML = '<span class="text-gray-500">No bio available yet. <a href="/edit-profile.html" class="text-blue-600 hover:underline">Add one</a> to tell clients about yourself!</span>';
        }
    }

    // Update skills section if available
    const skillsEl = document.getElementById('userSkills');
    if (skillsEl) {
        if (profile.skills && profile.skills.trim() !== '') {
            // Convert comma-separated list to neat badges
            const skillsArray = profile.skills.split(',').map(skill => skill.trim());
            skillsEl.innerHTML = skillsArray.map(skill =>
                `<span class="skill-badge">${skill}</span>`
            ).join('');
        } else {
            skillsEl.innerHTML = '<p class="text-gray-500">No skills listed yet. <a href="/edit-profile.html" class="text-blue-600 hover:underline">Add your top skills</a> to attract clients!</p>';
        }
    }

    // Check for profile completion
    const isProfileIncomplete = !profile.about || !profile.skills || profile.skills.trim() === '';
    const profileCompletionEl = document.getElementById('profileCompletion');

    if (profileCompletionEl && isProfileIncomplete) {
        profileCompletionEl.classList.remove('hidden');
    } else if (profileCompletionEl) {
        profileCompletionEl.classList.add('hidden');
    }
}

/**
 * Update the UI with job application information
 * @param {Array} applications - Job applications
 * @param {boolean} isNewUser - Whether this is a new user
 */
function updateApplicationsUI(applications, isNewUser) {
    const applicationsContainer = document.getElementById('jobApplications');
    if (!applicationsContainer) return;

    if (!applications || applications.length === 0) {
        // Enhanced empty state for new users
        applicationsContainer.innerHTML = `
            <div class="empty-state-container py-8 px-4 text-center">
                <div class="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No applications yet</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">You haven't applied to any jobs yet. Browse available jobs to get started.</p>
                <a href="/browse-jobs.html" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800">
                    <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Jobs
                </a>
            </div>
        `;
        return;
    }

    // Fetch job details for each application
    Promise.all(applications.map(app => fetchJobDetails(app.job_id)))
        .then(jobDetails => {
            const applicationsList = applications.map((app, index) => {
                const job = jobDetails[index] || { job_title: 'Unknown Job', company: 'Unknown Company' };
                const statusClass = getStatusClass(app.status);

                return `
                <div class="application-card ${statusClass}">
                    <h3>${job.job_title}</h3>
                    <p class="company-name">${job.company}</p>
                    <div class="application-status">
                        <span class="status-badge ${statusClass}">${app.status || 'pending'}</span>
                        <span class="application-date">${formatDate(app.createdAt)}</span>
                    </div>
                    <button class="view-details-btn" data-job-id="${app.job_id}">View Details</button>
                </div>
                `;
            }).join('');

            applicationsContainer.innerHTML = applicationsList;

            // Add event listeners to view details buttons
            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const jobId = this.getAttribute('data-job-id');
                    window.location.href = `/job-details.html?id=${jobId}`;
                });
            });
        });
}

/**
 * Update the UI with available jobs
 * @param {Array} jobs - Available jobs
 * @param {boolean} isNewUser - Whether this is a new user
 */
function updateAvailableJobsUI(jobs, isNewUser) {
    const jobsContainer = document.getElementById('availableJobs');
    if (!jobsContainer) return;

    if (!jobs || jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="empty-state-container py-6 px-4 text-center">
                <div class="inline-flex justify-center items-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </div>
                <p class="text-gray-600 dark:text-gray-400">No jobs available at the moment. Please check back later.</p>
            </div>
        `;
        return;
    }

    // Sort jobs by newest first
    const sortedJobs = [...jobs].sort((a, b) => {
        return new Date(b.createdAt || b._id.getTimestamp()) - new Date(a.createdAt || a._id.getTimestamp());
    });

    // Display only top 5 jobs
    const topJobs = sortedJobs.slice(0, 5);

    // Add a special recommended tag for new users
    const jobsList = topJobs.map((job, index) => {
        const isRecommended = isNewUser && index < 2; // Mark the first two jobs as recommended for new users

        return `
        <div class="job-card ${isRecommended ? 'border-l-4 border-green-500' : ''}">
            ${isRecommended ? '<span class="recommended-badge">Recommended</span>' : ''}
            <h3>${job.job_title}</h3>
            <p class="company-name">${job.company || 'Unknown Company'}</p>
            <div class="job-meta">
                <span class="job-category">${job.job_category}</span>
                <span class="job-location">${job.location_category}</span>
                <span class="job-duration">${job.duration_months} month${job.duration_months !== 1 ? 's' : ''}</span>
            </div>
            <p class="job-pay">$${job.total_pay}</p>
            <button class="view-job-btn" data-job-id="${job._id}">View Job</button>
        </div>
        `;
    }).join('');

    jobsContainer.innerHTML = jobsList;

    // Add event listeners to view job buttons
    document.querySelectorAll('.view-job-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            window.location.href = `/job-details.html?id=${jobId}`;
        });
    });
}

/**
 * Update the UI with user statistics
 * @param {Object} stats - User statistics
 * @param {boolean} isNewUser - Whether this is a new user
 */
function updateStatsUI(stats, isNewUser) {
    if (!stats) return;

    // Update application stats
    const totalAppsEl = document.getElementById('totalApplications');
    if (totalAppsEl) totalAppsEl.textContent = stats.totalApplications || 0;

    const acceptedAppsEl = document.getElementById('acceptedApplications');
    if (acceptedAppsEl) acceptedAppsEl.textContent = stats.acceptedApplications || 0;

    const pendingAppsEl = document.getElementById('pendingApplications');
    if (pendingAppsEl) pendingAppsEl.textContent = stats.pendingApplications || 0;

    const successRateEl = document.getElementById('successRate');
    if (successRateEl) {
        if (stats.totalApplications > 0) {
            successRateEl.textContent = `${Math.round(stats.successRate || 0)}%`;
        } else {
            successRateEl.innerHTML = '<span class="text-gray-500">N/A</span>';
        }
    }

    // Show earnings guidance for new users
    const earningsCardEl = document.getElementById('earningsCard');
    if (earningsCardEl && isNewUser) {
        const earningsPlaceholder = document.createElement('div');
        earningsPlaceholder.className = 'earnings-placeholder text-center p-4 border-t border-gray-200 dark:border-gray-700 mt-4';
        earningsPlaceholder.innerHTML = `
            <p class="text-sm text-gray-600 dark:text-gray-400">
                Your earnings chart will appear here once you complete a job. 
                <a href="/browse-jobs.html" class="text-blue-600 hover:underline">Start applying</a> to see your progress!
            </p>
        `;

        earningsCardEl.appendChild(earningsPlaceholder);
    }
}

/**
 * Fetch job details by job ID
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} Job details
 */
async function fetchJobDetails(jobId) {
    try {
        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching job details for job ${jobId}:`, error);
        return null;
    }
}

/**
 * Get status class for styling
 * @param {string} status - Application status
 * @returns {string} CSS class for status
 */
function getStatusClass(status) {
    switch (status) {
        case 'accepted':
            return 'status-accepted';
        case 'rejected':
            return 'status-rejected';
        case 'pending':
        default:
            return 'status-pending';
    }
}

/**
 * Format date to readable string
 * @param {string|Date} dateStr - Date string or object
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
    if (!dateStr) return 'Unknown date';

    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Update user basic information
 * @param {Object} userData - User data
 */
function updateUserInfo(userData) {
    if (!userData) return;

    // Update greeting if element exists
    const greetingEl = document.getElementById('userGreeting');
    if (greetingEl && userData.displayName) {
        greetingEl.textContent = `Welcome back, ${userData.displayName}!`;
    }

    // Update user avatar if element exists
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl && userData.photoURL) {
        avatarEl.src = userData.photoURL;
    }
}

/**
 * Show loading state with custom message
 * @param {string} message - Loading message
 */
function showLoadingState(message) {
    const loadingElement = document.getElementById('loadingIndicator');
    if (!loadingElement) {
        // Create loading indicator if it doesn't exist
        const loader = document.createElement('div');
        loader.id = 'loadingIndicator';
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <p id="loadingMessage">${message || 'Loading...'}</p>
        `;
        document.body.appendChild(loader);
    } else {
        loadingElement.classList.remove('hidden');
        const messageElement = document.getElementById('loadingMessage');
        if (messageElement) {
            messageElement.textContent = message || 'Loading...';
        }
    }
}

/**
 * Update loading state message
 * @param {string} message - New loading message
 */
function updateLoadingState(message) {
    const messageElement = document.getElementById('loadingMessage');
    if (messageElement) {
        messageElement.textContent = message || 'Loading...';
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) {
        // Create error container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'errorContainer';
        container.className = 'error-container';
        container.innerHTML = `
            <p id="errorMessage">${message}</p>
            <button id="dismissError">×</button>
        `;
        document.body.appendChild(container);

        // Add event listener to dismiss button
        document.getElementById('dismissError').addEventListener('click', () => {
            container.classList.add('hidden');
        });
    } else {
        errorContainer.classList.remove('hidden');
        const messageElement = document.getElementById('errorMessage');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
}

/**
 * Setup event listeners for dashboard interactions
 */
function setupEventListeners() {
    // Example: Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            window.location.href = '/edit-profile.html';
        });
    }

    // Example: View all jobs button
    const viewAllJobsBtn = document.getElementById('viewAllJobsBtn');
    if (viewAllJobsBtn) {
        viewAllJobsBtn.addEventListener('click', () => {
            window.location.href = '/browse-jobs.html';
        });
    }

    // Example: View all applications button
    const viewAllAppsBtn = document.getElementById('viewAllApplicationsBtn');
    if (viewAllAppsBtn) {
        viewAllAppsBtn.addEventListener('click', () => {
            window.location.href = '/my-applications.html';
        });
    }

    // Example: Refresh data button
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', async () => {
            showLoadingState('Refreshing data...');

            const currentUser = firebase.auth().currentUser;
            if (!currentUser) {
                showErrorMessage('Authentication error. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                return;
            }

            try {
                const [profile, applications, jobs, stats] = await Promise.all([
                    loadUserProfile(currentUser.uid),
                    loadJobApplications(currentUser.uid),
                    loadAvailableJobs(),
                    loadUserStats(currentUser.uid)
                ]);

                // Check if user is new
                const isNewUser = applications.length === 0;

                updateUserProfileUI(profile);
                updateApplicationsUI(applications, isNewUser);
                updateAvailableJobsUI(jobs, isNewUser);
                updateStatsUI(stats, isNewUser);

                hideLoadingState();
            } catch (error) {
                console.error('Error refreshing data:', error);
                showErrorMessage('Failed to refresh data. Please try again.');
                hideLoadingState();
            }
        });
    }

    // Add event listeners for getting started guides
    setupNewUserGuides();
}

/**
 * Setup guided tour and help elements for new users
 */
function setupNewUserGuides() {
    const guideButtons = document.querySelectorAll('.guide-button');

    guideButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const guideId = this.getAttribute('data-guide');
            showGuide(guideId);
        });
    });

    // Profile completion tracker
    const profileCompletionEl = document.getElementById('profileCompletion');
    if (profileCompletionEl) {
        const completeProfileBtn = profileCompletionEl.querySelector('.complete-profile-btn');
        if (completeProfileBtn) {
            completeProfileBtn.addEventListener('click', () => {
                window.location.href = '/edit-profile.html';
            });
        }
    }
}

/**
 * Show specific guide for new users
 * @param {string} guideId - Guide identifier
 */
function showGuide(guideId) {
    // Hide all guides first
    document.querySelectorAll('.user-guide').forEach(guide => {
        guide.classList.add('hidden');
    });

    // Show the selected guide
    const selectedGuide = document.getElementById(guideId);
    if (selectedGuide) {
        selectedGuide.classList.remove('hidden');
    }
}

// Export dashboard functions for potential reuse
export {
    loadUserProfile,
    loadJobApplications,
    loadAvailableJobs,
    showLoadingState,
    hideLoadingState
};