let selectedRole = null;

//get the role 
const clientSelected = document.getElementById("Hiring_Comp_box");
const FreelancerSelected = document.getElementById("Freelancer_box");

//add eventlisteners
clientSelected.addEventListener('click', () =>{
    selectedRole = "client";
});

FreelancerSelected.addEventListener('click', () =>{
    selectedRole = "user";
});


// Form submission handler
document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();  // Prevent form from reloading the page

    // Check if role is selected
    if (!selectedRole) {
        alert("Please select a user type.");
        return;
    }

    // Store the role in sessionStorage
    sessionStorage.setItem('role', selectedRole);
    
    // Send the data to the server (using the Firebase ID and token if required)
    const firebaseId = sessionStorage.getItem('firebaseId');
    const idToken = sessionStorage.getItem('idToken');
    const providerId = sessionStorage.getItem('provider');

    const data = {
        firebaseId: firebaseId,
        provider : providerId,
        role: selectedRole,
    };

    try {
        const response = await fetch("http://localhost:3000/auth/add-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`, // Firebase ID token
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to assign role to the user");
        }

        const responseData = await response.json();

        // Redirect to another page after successful submission
        window.location.href = responseData.RedirectTo;
    } catch (error) {
        console.error("Error:", error);
    }
});
