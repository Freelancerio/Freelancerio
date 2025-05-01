let selectedRole = null;

const clientSelected = document.getElementById("Hiring_Comp_box");
const freelancerSelected = document.getElementById("Freelancer_box");

// Add click event listeners
clientSelected.addEventListener('click', () => {
    selectedRole = "client";
    clientSelected.classList.add("selected-role");
    freelancerSelected.classList.remove("selected-role");
});

freelancerSelected.addEventListener('click', () => {
    selectedRole = "user";
    freelancerSelected.classList.add("selected-role");
    clientSelected.classList.remove("selected-role");
});

// Handle form submission
document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();

    if (!selectedRole) {
        alert("Please select a user type.");
        return;
    }

    sessionStorage.setItem('role', selectedRole);

    const firebaseId = sessionStorage.getItem('firebaseId');
    const idToken = sessionStorage.getItem('idToken');
    const providerId = sessionStorage.getItem('provider');

    const data = {
        firebaseId: firebaseId,
        provider: providerId,
        role: selectedRole,
    };

    try {
        const response = await fetch("http://localhost:3000/auth/add-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to assign role to the user");
        }

        const responseData = await response.json();
        window.location.href = responseData.RedirectTo;
    } catch (error) {
        console.error("Error:", error);
    }
});