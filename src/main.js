const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

// Middleware to parse JSON data in request body
app.use(express.json());

// CORS middleware
app.use(cors());

// For serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Import routes
const userRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');


// Use routes
app.use('/auth', userRoutes);
app.use('/job', jobRoutes);


// Render the index.html => this is where the user logs in
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Render the role-selection.html => this is where the user selects their role on the system
app.get('/role-selection', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/role-selection.html'));
});

// Render the home page => this is the page where the user lands when they are successfully logged in
app.get('/client-home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/client-home.html'));
});

// Render the profile page of the freelancer
app.get('/profile-user', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/profile-user.html'))
});


// Render the client jobs page
app.get('/client-jobs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/client-jobs.html'))
});

// Render the client jobs page
app.get('/view-freelancer', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/freelancer-view.html'))
});

// Render the job single page of the freelancer
app.get('/job-details', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/single-job-post.html'))
});

// Render the apply page to apply for a job
app.get('/apply', (req, res) => {
  // The jobId will be available as req.query.jobId
  // const jobId = req.query.jobId;
  const jobId = sessionStorage.firebaseId;

  if (!jobId) {
    // Redirect to jobs listing if no job ID is provided
    return res.redirect('/freelancer-home');
  }

  console.log('Job application started for job ID:', jobId);


  res.sendFile(path.join(__dirname, 'public/pages/apply.html'));
});

app.get('/freelancer-home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/home.html'));
});

// Render the home page => this is the page where the user lands when they are successfully logged in
app.get('/user-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/user-dashboard.html'));
});

// Render the 404 error page (when the route doesn't exist)
app.get('/error-404', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/404.html'));
});

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/pages/404.html'));
});

// MongoDB connection and server start
const db_url = "mongodb+srv://freelance-io-admin:freelance-io-admin@freelanceio-cluster.5hizeeq.mongodb.net/freelanceio-db?retryWrites=true&w=majority&appName=freelanceio-cluster";
mongoose.connect(db_url)
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
