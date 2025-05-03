/**
 * @jest-environment jsdom
 */

describe('job-details page', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="job-title"></div>
        <div id="company-name"></div>
        <div id="job-description"></div>
      `;
  
      delete window.location;
      window.location = {
        search: '?id=abc123'
      };
    });
  
    it.skip('displays job details when fetch succeeds', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              job_title: 'Frontend Developer',
              company: 'TechCorp',
              job_description: 'Build amazing UIs'
            })
        })
      );
  
      require('../../public/scripts/job-details');
      document.dispatchEvent(new Event('DOMContentLoaded'));
  
      await new Promise(resolve => setTimeout(resolve, 0));
  
      expect(document.getElementById('job-title').textContent).toBe('Frontend Developer');
      expect(document.getElementById('company-name').textContent).toBe('TechCorp');
      expect(document.getElementById('job-description').textContent).toBe('Build amazing UIs');
    });
  
    it('displays error message if job ID is missing', async () => {
      delete window.location;
      window.location = { search: '' };
      document.body.innerHTML = '';
  
      require('../../public/scripts/job-details');
      document.dispatchEvent(new Event('DOMContentLoaded'));
  
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(document.body.innerHTML).toContain('Job ID not found');
    });
  
    it('displays error message if fetch fails', async () => {
      window.location.search = '?id=fail123';
      global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
  
      require('../../public/scripts/job-details');
      document.dispatchEvent(new Event('DOMContentLoaded'));
  
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(document.body.innerHTML).toContain('Error loading job details');
    });
  });
  