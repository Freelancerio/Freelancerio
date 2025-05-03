// Fetch user details from Firebase
document.addEventListener('DOMContentLoaded', async () => {
    let user = true;

    document.getElementById("user-name").textContent = `${sessionStorage.getItem("display-name")}`

    if (user) {
        // Populate the user profile details
        document.getElementById('user-name-display').textContent = sessionStorage.getItem("display-name") || "Unknown user";
        document.getElementById('user-email').textContent = sessionStorage.getItem("email") || "No email available";

        // Display the profile picture
        document.getElementById('user-profile-picture').src = sessionStorage.getItem("photoURL") || 'https://www.example.com/default-profile.jpg';
    } else {
        // If no user is logged in, display a fallback message
        document.getElementById('user-name-display').textContent = "Guest";
        document.getElementById('user-email').textContent = "Not logged in";
        document.getElementById('user-profile-picture').src = 'https://www.example.com/default-profile.jpg';
    }
});