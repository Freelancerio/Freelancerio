const checkbox = document.getElementById('consentCheckbox');
const submitBtn = document.getElementById('submitBtn');

checkbox.addEventListener('change', (e) => {
    submitBtn.style.display = e.target.checked ? 'block' : 'none';
});

submitBtn.addEventListener('click', () => {
    // Handle application submission here
    window.location.href = '/application-success'; // Redirect after submission
});