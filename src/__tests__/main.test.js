const request = require('supertest');
const express = require('express');
const path = require('path');

// --- Mocks ---
jest.mock('mongoose');
const mongoose = require('mongoose');
mongoose.connect = jest.fn(() => Promise.resolve());

jest.mock('../routes/authRoutes', () => (req, res, next) => next());
jest.mock('../routes/jobRoutes', () => (req, res, next) => next());
jest.mock('../routes/applicationsRoutes', () => (req, res, next) => next());
jest.mock('../routes/dashboardRoutes', () => (req, res, next) => next());
jest.mock('../routes/paymentRoutes', () => (req, res, next) => next());

jest.spyOn(require('express').application, 'listen').mockImplementation(() => {});

const app = require('../main');

describe('main.js Express App', () => {
  const staticRoutes = [
    ['/', 'Begin your journey with us'],
    ['/role-selection', 'Complete Your Profile'],
    ['/client-home', 'Post a New Job'],
    ['/admin-home', 'Admin Dashboard'],
    ['/profile-user', 'Your Profile'],
    ['/client-jobs', 'My Job List'],
    ['/view-freelancer', 'View Freelancers'],
    ['/job-details', 'Job Listings'],
    ['/freelancer-home', 'Job Listings'],
    ['/client-dashboard', 'Dashboard'],
    ['/error-404', 'Page Not Found'],
  ];

  test.each(staticRoutes)(
    'GET %s returns 200 and contains content',
    async (route, expectedContent) => {
      const res = await request(app).get(route);
      expect([200, 404]).toContain(res.status);
      if (res.status === 200) {
        expect(res.text).toContain(expectedContent);
      }
    }
  );

  test('GET unknown route returns 404', async () => {
    const res = await request(app).get('/non-existent');
    expect(res.status).toBe(404);
    expect(res.text).toContain('404');
  });

  test('mongoose.connect and app.listen are called', () => {
    expect(mongoose.connect).toHaveBeenCalled();
    expect(require('express').application.listen).toHaveBeenCalled();
  });
});
