/**
 * @jest-environment jsdom
 */

describe('client-home form builder', () => {
    beforeEach(() => {
      // 🧱 Set up all required DOM elements BEFORE loading the script
      document.body.innerHTML = `
        <button id="post_job"></button>
        <div id="display-section"></div>
        <h1 id="client-page-heading"></h1>
      `;
  
      // 🧠 Now safely load the script (it attaches to #post_job)
      require('../../public/scripts/client-home');
  
      // ✅ Simulate DOMContentLoaded event
      document.dispatchEvent(new Event('DOMContentLoaded'));
  
      // Simulate a click to trigger the form builder
      document.getElementById('post_job').click();
    });
  
    it('renders the job post form in #display-section', () => {
      const article = document.querySelector('#display-section article');
      expect(article).toBeTruthy();
      expect(article.classList.contains('bg-white')).toBe(true);
    });
  
    it('includes required form fields like Job Title and Job Description', () => {
      expect(document.getElementById('jobTitle')).toBeTruthy();
      expect(document.getElementById('jobDescription')).toBeTruthy();
    });
  
    it('updates the client-page heading to "Post a New Job"', () => {
      const heading = document.getElementById('client-page-heading');
      expect(heading.textContent).toBe('Post a New Job');
    });
  });
  