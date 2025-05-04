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
const applicationRoutes = require('./routes/applicationsRoutes');


// Use routes
app.use('/auth', userRoutes);
app.use('/job', jobRoutes);
app.use('/apply',applicationRoutes);


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
app.get('/profile-user', (req,res) => {
  res.sendFile(path.join(__dirname,'../public/pages/profile-user.html'))
});


// Render the client jobs page
app.get('/client-jobs', (req,res) => {
  res.sendFile(path.join(__dirname,'../public/pages/client-home.html'))
});

// Render the client jobs page
app.get('/view-freelancer', (req,res) => {
  res.sendFile(path.join(__dirname,'../public/pages/client-home.html'))
});

// Render the job single page of the freelancer
app.get('/job-details', (req,res) => {
  res.sendFile(path.join(__dirname,'../public/pages/single-job-post.html'))
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

