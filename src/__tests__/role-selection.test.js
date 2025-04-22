/**
 * @jest-environment jsdom
 */

describe('Role Selection', () => {
    let alertMock, fetchMock;
  
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="Hiring_Comp_box">Client</div>
        <div id="Freelancer_box">Freelancer</div>
        <button id="submit">Continue</button>
      `;
  
      // Reset sessionStorage
      const sessionStore = {};
      global.sessionStorage = {
        setItem: (key, value) => sessionStore[key] = value,
        getItem: (key) => sessionStore[key] || null,
        clear: () => Object.keys(sessionStore).forEach(k => delete sessionStore[k]),
      };
  
      // Mock alert
      alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  
      // Mock location
      delete window.location;
      window.location = { href: '' };
  
      // Mock fetch
      fetchMock = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ RedirectTo: '/pages/main.html' })
        })
      );
      global.fetch = fetchMock;
    });
  
    afterEach(() => {
      jest.resetModules(); // ⬅️ Clear module state (important for selectedRole)
      jest.restoreAllMocks();
    });
  
    test('clicking client selects client role', () => {
      require('../../public/scripts/role-selection'); // Import *inside* test
      document.getElementById('Hiring_Comp_box').click();
      document.getElementById('submit').click();
  
      expect(sessionStorage.getItem('role')).toBe('client');
    });
  
    test('clicking freelancer selects user role', () => {
      require('../../public/scripts/role-selection');
      document.getElementById('Freelancer_box').click();
      document.getElementById('submit').click();
  
      expect(sessionStorage.getItem('role')).toBe('user');
    });
  
    test('submitting without selection triggers alert', () => {
      require('../../public/scripts/role-selection');
      document.getElementById('submit').click();
      expect(alertMock).toHaveBeenCalledWith("Please select a user type.");
    });
  
    test('successful role submission triggers redirect', async () => {
      require('../../public/scripts/role-selection');
      document.getElementById('Hiring_Comp_box').click();
      await document.getElementById('submit').click();
  
      // Let promise resolve (use nextTick instead of setImmediate for cross-platform)
      await new Promise(process.nextTick);
  
      expect(fetchMock).toHaveBeenCalled();
      expect(window.location.href).toBe('/pages/main.html');
    });
  });
  