document.addEventListener("DOMContentLoaded", () => {
    const btnSubmit = document.getElementById("jpostJobBtn");
    let uid = sessionStorage.getItem('firebaseId');
  
    btnSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Disable button during submission
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Posting...";

        try {
            // Validate and collect form data
            const totalPay = parseFloat(document.getElementById("totalPay").value);
            if (isNaN(totalPay) || totalPay <= 0) {
                throw new Error("Please enter a valid payment amount");
            }

            const formData = {
                client_id: uid,
                job_title: document.getElementById("jobTitle").value.trim(),
                job_description: document.getElementById("jobDescription").value.trim(),
                job_requirements: document.getElementById("jobRequirements").value.trim(),
                job_category: document.getElementById("jobCategory").value,
                total_pay: totalPay,
                taken_status: false
            };

            // Validate required fields
            if (!formData.job_title || !formData.job_description || !formData.job_requirements || !formData.job_category) {
                throw new Error("Please fill all required fields");
            }

            console.log("Submitting job:", formData);

            const response = await fetch("http://localhost:3000/job/add-job", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Success:", result);
            
            // Show success message
            alert("Job posted successfully!");
            
            // Clear form fields
            document.getElementById("jobTitle").value = "";
            document.getElementById("jobDescription").value = "";
            document.getElementById("jobRequirements").value = "";
            document.getElementById("jobCategory").value = "";
            document.getElementById("totalPay").value = "";

        } catch (err) {
            console.error("Job posting failed:", err);
            alert(err.message || "There was an error posting the job. Please try again.");
        } finally {
            // Re-enable button
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Post Job";
        }
    });
});