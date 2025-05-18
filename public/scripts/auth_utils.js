// auth_utils.js - Enhanced authentication utilities

/**
 * Check Firebase auth status with comprehensive error handling and persistent session management
 * @returns {Promise<Object|null>} Firebase user object or null if not authenticated
 */
async function checkAuthStatus() {
    try {
        // First try to use cached user from session storage for immediate UI response
        const cachedUser = sessionStorage.getItem('currentUser');
        let cachedUserObj = null;

        if (cachedUser) {
            try {
                cachedUserObj = JSON.parse(cachedUser);
                // Update UI immediately with cached data for better UX
                updateUIWithUserData(cachedUserObj);
            } catch (e) {
                console.warn('Failed to parse cached user data:', e);
                sessionStorage.removeItem('currentUser'); // Clear invalid cache
            }
        }

        return new Promise((resolve, reject) => {
            // Check if Firebase is properly initialized
            if (typeof firebase === 'undefined') {
                console.error('Firebase is not initialized. Check if the Firebase SDK is properly loaded.');
                fallbackToSessionCheck(resolve, reject, cachedUserObj);
                return;
            }

            // Check if auth is available
            if (!firebase.auth) {
                console.error('Firebase auth is not available. Check Firebase configuration.');
                fallbackToSessionCheck(resolve, reject, cachedUserObj);
                return;
            }

            // Add timeout to prevent hanging if Firebase auth hangs
            const timeout = setTimeout(() => {
                console.warn('Firebase auth check timed out, falling back to session check');
                fallbackToSessionCheck(resolve, reject, cachedUserObj);
            }, 3000); // Reduced timeout for better UX

            // Check auth state
            const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                clearTimeout(timeout);
                unsubscribe(); // Important: Unsubscribe to prevent memory leaks

                if (user) {
                    // Cache user data for quick access
                    const userData = {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    };

                    sessionStorage.setItem('currentUser', JSON.stringify(userData));

                    // Verify user role with backend for proper redirection
                    verifyUserRoleWithBackend(user.uid)
                        .then(roleData => {
                            // Add role information to user object
                            if (roleData && roleData.exists) {
                                // Store role for future reference
                                sessionStorage.setItem('userRole', roleData.role || 'unknown');
                            }
                            resolve(user);
                        })
                        .catch(err => {
                            console.warn('Role verification error:', err);
                            resolve(user); // Still resolve with user even if role check fails
                        });
                } else {
                    sessionStorage.removeItem('currentUser');
                    sessionStorage.removeItem('userRole');
                    resolve(null);
                }
            }, (error) => {
                clearTimeout(timeout);
                unsubscribe(); // Unsubscribe on error too
                console.error('Firebase auth error:', error);
                fallbackToSessionCheck(resolve, reject, cachedUserObj);
            });
        });
    } catch (error) {
        console.error('Auth check critical error:', error);
        // Try to get cached user as last resort
        const cachedUser = sessionStorage.getItem('currentUser');
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        return null;
    }
}

/**
 * Fall back to session check if Firebase auth fails
 * @param {Function} resolve - Promise resolve function
 * @param {Function} reject - Promise reject function
 * @param {Object|null} cachedUser - Cached user data from session storage
 */
function fallbackToSessionCheck(resolve, reject, cachedUser = null) {
    // If we have cached user data, use it
    if (cachedUser) {
        console.log('Using cached user data for auth fallback');
        resolve(cachedUser);
        return;
    }

    // Otherwise, try to get it from session storage
    try {
        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) {
            resolve(JSON.parse(sessionUser));
        } else {
            // Make a backend call to check session status
            fetch('/api/auth/session-check')
                .then(response => response.json())
                .then(data => {
                    if (data.authenticated) {
                        resolve(data.user);
                    } else {
                        resolve(null);
                    }
                })
                .catch(error => {
                    console.error('Session check failed:', error);
                    resolve(null);
                });
        }
    } catch (e) {
        console.error('Session fallback error:', e);
        resolve(null);
    }
}

/**
 * Verify user role with backend and ensure proper redirection
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Object>} User role data
 */
async function verifyUserRoleWithBackend(userId) {
    try {
        const response = await fetch(`/api/users/check?id=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying user role:', error);
        throw error;
    }
}

/**
 * Update UI elements immediately with user data
 * @param {Object} userData - User data object
 */
function updateUIWithUserData(userData) {
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
        avatarEl.alt = userData.displayName || 'User';
    }
}

/**
 * Get authentication token for API requests
 * @returns {Promise<string|null>} Firebase ID token or null if not authenticated
 */
async function getAuthToken() {
    try {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available for token retrieval');
            return null;
        }

        const user = firebase.auth().currentUser;
        if (!user) {
            console.warn('No current user for token retrieval');
            return null;
        }

        return await user.getIdToken(true);
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

// Export all utility functions
export {
    checkAuthStatus,
    verifyUserRoleWithBackend,
    getAuthToken
};