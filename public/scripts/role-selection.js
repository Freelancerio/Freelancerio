// Store the selected role in a variable
let selectedRole = null;

// Function to handle the role selection
function selectRole(role) {
    selectedRole = role;
    
    // Highlight the selected role
    const freelancerBox = document.getElementById('Freelancer_box');
    const hiringCompBox = document.getElementById('Hiring_Comp_box');
    
    if (role === 'Freelancer') {
        freelancerBox.classList.add('selected');
        hiringCompBox.classList.remove('selected');
    } else if (role === 'Hiring Company') {
        hiringCompBox.classList.add('selected');
        freelancerBox.classList.remove('selected');
    }
}

// Form submission handler
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent form from reloading the page

    // Check if role is selected
    if (!selectedRole) {
        alert("Please select a user type.");
        return;
    }

    // Store the role in sessionStorage
    sessionStorage.setItem('role', selectedRole);
    
    // Send the data to the server (using the Firebase ID and token if required)
    const firebaseId = sessionStorage.getItem('firebaseId'); // Assuming you've already saved the Firebase UID
    const idToken = sessionStorage.getItem('idToken'); // Assuming you've already saved the Firebase ID Token

    const data = {
        firebaseId: firebaseId,
        idToken: idToken,
        role: selectedRole,
    };

    try {
        const response = await fetch("https://localhost:3000/auth/assign-role", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to assign role to the user");
        }

        const responseData = await response.json();
        console.log("Role assignment response:", responseData);

        // Redirect to another page after successful submission
        window.location.href = "./user-dashboard";
    } catch (error) {
        console.error("Error:", error);
    }
});
