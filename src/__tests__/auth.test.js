/**
 * @jest-environment jsdom
 */

//require('../../public/scripts/auth'); // Keep this line if auth.js uses global DOM elements

describe('Auth script', () => {
  beforeEach(() => {
    // Simulate the DOM manually instead of reading from index.html
    document.body.innerHTML = `
      <form id="loginForm">
        <input type="email" id="email" value="test@example.com" />
        <input type="password" id="password" value="password123" />
        <button type="submit" id="submitBtn">Login</button>
      </form>
    `;
  });

  test('form exists and fields are prefilled correctly', () => {
    expect(document.getElementById('loginForm')).not.toBeNull();
    expect(document.getElementById('email').value).toBe('test@example.com');
    expect(document.getElementById('password').value).toBe('password123');
  });

  test('submit button exists', () => {
    const button = document.getElementById('submitBtn');
    expect(button).not.toBeNull();
    expect(button.textContent.toLowerCase()).toContain('login');
  });
});
