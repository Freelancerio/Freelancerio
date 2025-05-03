/**
 * @jest-environment jsdom
 */

const { createJobItem } = require('../../public/scripts/freelancer-home');

describe('createJobItem', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="job-list"></div>';
  });

  it('creates a job article and appends to .job-list', () => {
    const sampleJob = {
      _id: '123',
      job_title: 'Web Developer',
      company: 'Freelancer Inc',
      total_pay: '$5000'
    };

    createJobItem(sampleJob);

    const article = document.querySelector('.job-list article');
    expect(article).toBeTruthy();
    expect(article.querySelector('h2.job-title').textContent).toBe('Web Developer');
    expect(article.querySelector('a.company').textContent).toBe('Freelancer Inc');

    const dds = article.querySelectorAll('dd');
    expect(dds[1].textContent).toContain('$5000');  // "Rate" is second <dd>
  });

  it('redirects to correct job details page on click', () => {
    const sampleJob = {
      _id: '456',
      job_title: 'Designer',
      company: 'DesignCo',
      total_pay: '$3000'
    };

    delete window.location;
    window.location = { href: '' };

    createJobItem(sampleJob);
    document.querySelector('.job').click();

    expect(window.location.href).toBe('/job-details?id=456');
  });
});
