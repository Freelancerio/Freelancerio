import getBaseUrl from './base-url.mjs';
const baseURL = getBaseUrl();

document.addEventListener('DOMContentLoaded', () => {
    const firebaseId = sessionStorage.getItem('firebaseId');

    // Get user details on page load
    const getUserDetails = async () => {
        try {
            const response = await fetch(`${baseURL}/auth/get-user/${firebaseId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const user = await response.json();

            // Set user details to the page
            document.getElementById("user-name").textContent = `${user.user.displayName || "Unknown User"}`;
            document.getElementById("user-name-display").textContent = user.user.displayName || "Unknown User";
            document.getElementById("user-email").textContent = user.user.email|| "No email available";
            document.getElementById("user-profile-picture").src = user.user.photoURL || "https://www.gravatar.com/avatar/default?s=200&d=mp";

            // Fill display section
            document.getElementById("skills-display").textContent = user.user.skills || "No skills listed";
            document.getElementById("about-display").textContent = user.user.about|| "No about information provided";

            // Prefill form
            document.getElementById("skills").value = user.user.skills  || '';
            document.getElementById("about").value = user.user.about || '';
        } catch (error) {
            console.error("Error fetching user details:", error);
            alert("There was an error fetching your details.");
        }
    };

    getUserDetails();

    const displaySection = document.getElementById("display-section");
    const editForm = document.getElementById("edit-form");

    document.getElementById("edit-btn").addEventListener("click", () => {
        displaySection.classList.add("hidden");
        editForm.classList.remove("hidden");
    });

    document.getElementById("cancel-btn").addEventListener("click", () => {
        editForm.classList.add("hidden");
        displaySection.classList.remove("hidden");
    });

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const updatedSkills = document.getElementById("skills").value;
        const updatedAbout = document.getElementById("about").value;

        try {
            // Send PUT request to update skills and about
            const response = await fetch(`${baseURL}/auth/updateUser/${firebaseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    skills: updatedSkills,
                    about: updatedAbout
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update user details');
            }

            // Update session storage with new details
            sessionStorage.setItem("skills", updatedSkills);
            sessionStorage.setItem("about", updatedAbout);

            // Update the display section
            document.getElementById("skills-display").textContent = updatedSkills;
            document.getElementById("about-display").textContent = updatedAbout;

            // Hide edit form and show display section
            editForm.classList.add("hidden");
            displaySection.classList.remove("hidden");

        } catch (error) {
            console.error("Error updating user details:", error);
            alert("There was an error updating your details.");
        }
    });
});
