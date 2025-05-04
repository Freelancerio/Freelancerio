/**
 * @jest-environment jsdom
 */

// Dummy elements to prevent script errors
document.body.innerHTML = `
  <button id="view_freelancers"></button>
  <button id="post_job"></button>
  <div id="display-section"></div>
`;

// Load script AFTER DOM is mocked
const { createFreelancerItem } = require('../../public/scripts/view-freelancer');

describe('createFreelancerItem', () => {
  beforeEach(() => {
    document.getElementById("display-section").innerHTML = '';
  });

  it('creates a freelancer article with username and email', () => {
    const sampleFreelancer = {
      username: 'coder123',
      email: 'coder@example.com'
    };

    createFreelancerItem(sampleFreelancer);

    const article = document.querySelector('#display-section article');
    expect(article).toBeTruthy();
    expect(article.classList.contains('freelancer')).toBe(true);

    const h2 = article.querySelector('h2.freelancer-username');
    expect(h2.textContent).toBe('coder123');

    const emailLink = article.querySelector('a.freelancer-email');
    expect(emailLink.href).toBe('mailto:coder@example.com');
  });
});
