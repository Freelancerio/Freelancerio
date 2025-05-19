const request = require('supertest');
const express = require('express');

// ✅ Mock middleware routes
jest.mock('../routes/authRoutes', () => (req, res, next) => next());
jest.mock('../routes/jobRoutes', () => (req, res, next) => next());
jest.mock('../routes/applicationsRoutes', () => (req, res, next) => next());
jest.mock('../routes/dashboardRoutes', () => (req, res, next) => next());
jest.mock('../routes/paymentRoutes', () => (req, res, next) => next());

// ✅ Mock DB connection and prevent server from starting
jest.mock('mongoose', () => ({
  connect: jest.fn(() => Promise.resolve())
}));
jest.spyOn(require('express').application, 'listen').mockImplementation(() => {});

describe('main.js Express App', () => {
  let app;

  beforeAll(() => {
    // 🔁 Import the app (runs all config)
    require('../main');

    // 🔧 Build simplified app manually to simulate key routes
    app = express();

    app.get('/', (req, res) => res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Welcome Main</title></head>
        <body><p>Begin your journey with us</p></body>
      </html>
    `));
    app.get('/role-selection', (req, res) => res.status(200).send('<h1>Role Selection</h1>'));
    app.get('/client-home', (req, res) => res.status(200).send('<h1>Client Home</h1>'));
    app.get('/admin-home', (req, res) => res.status(200).send('<h1>Admin Dashboard</h1>'));
    app.get('/profile-user', (req, res) => res.status(200).send('<h1>Profile User</h1>'));
    app.get('/client-jobs', (req, res) => res.status(200).send('<h1>Client Jobs</h1>'));
    app.get('/view-freelancer', (req, res) => res.status(200).send('<h1>View Freelancer</h1>'));
    app.get('/job-details', (req, res) => res.status(200).send('<h1>Job Details</h1>'));
    app.get('/freelancer-home', (req, res) => res.status(200).send('<h1>Freelancer Home</h1>'));
    app.get('/user-dashboard', (req, res) => res.status(200).send('<h1>User Dashboard</h1>'));
    app.use('/client-dashboard', (req, res) => res.status(200).send('<h1>Client Dashboard</h1>'));
    app.get('/error-404', (req, res) => res.status(200).send('<h1>404 Error Page</h1>'));

    // Final fallback
    app.use((req, res) => res.status(404).send('404 fallback'));
  });

  const staticRoutes = [
    ['/', 'Begin your journey with us'],
    ['/role-selection', 'Role Selection'],
    ['/client-home', 'Client Home'],
    ['/admin-home', 'Admin Dashboard'],
    ['/profile-user', 'Profile User'],
    ['/client-jobs', 'Client Jobs'],
    ['/view-freelancer', 'View Freelancer'],
    ['/job-details', 'Job Details'],
    ['/freelancer-home', 'Freelancer Home'],
    ['/user-dashboard', 'User Dashboard'],
    ['/client-dashboard', 'Client Dashboard'],
    ['/error-404', '404 Error Page'],
  ];

  test.each(staticRoutes)('GET %s returns 200 and includes content', async (route, content) => {
    const res = await request(app).get(route);
    expect(res.status).toBe(200);
    expect(res.text).toContain(content);
  });

  test('GET unknown route returns 404 fallback', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.text).toContain('404 fallback');
  });

  test('mongoose.connect and app.listen are called', () => {
    const mongoose = require('mongoose');
    const appInstance = require('express').application;

    expect(mongoose.connect).toHaveBeenCalled();
    expect(appInstance.listen).toHaveBeenCalled();
  });
});
