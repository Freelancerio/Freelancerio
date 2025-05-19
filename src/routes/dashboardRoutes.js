const express = require('express');
const router = express.Router();
const { User } = require('../models/userModel');
const Job = require('../models/jobModel');
const JobApplication = require('../models/applicationModel');

// Get all users
router.get('/users', async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter);
  res.json(users);
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  const { category } = req.query;
  const filter = category ? { job_category: category } : {};
  const jobs = await Job.find(filter);
  res.json(jobs);
});

// Get all applications
router.get('/applications', async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const applications = await JobApplication.find(filter);
  res.json(applications);
});

// Dashboard summary
router.get('/summary', async (req, res) => {
  const [totalUsers, totalJobs, totalApps, users, jobs] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    JobApplication.countDocuments(),
    User.find(),
    Job.find()
  ]);

  const freelancers = users.filter(u => u.role === 'user').length;
  const clients = users.filter(u => u.role === 'client').length;

  const jobsByCategory = jobs.reduce((acc, job) => {
    acc[job.job_category] = (acc[job.job_category] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalUsers,
    totalJobs,
    totalApps,
    freelancers,
    clients,
    jobsByCategory
  });
});

module.exports = router;
