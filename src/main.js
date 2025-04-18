const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000; 


// import routes
const userRoutes = require('./routes/authRoutes');

//for serving static files
app.use(express.static(path.join(__dirname, 'public')));

//use routes
app.use('/auth',userRoutes);
app.use('/jobs')

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/pages/404.html'));
});

//render the index.html => this is where the user logs in
app.get('/', (req,res) =>{
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//render the role-selection.html => this is where the user selects their role on the system
app.get('/role-selection', (req,res) =>{
  res.sendFile(path.join(__dirname, 'public/pages/role-selection.html'));
});

//render the home page => this is th page where the user lands when they are successfully logged in
app.get('/home', (req,res) =>{
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});


//render the 404 error page
app.get('/error-404', (req,res) =>{
  res.sendFile(path.join(__dirname, 'public/pages/404.html'));
});


//this is the connection url to the database
const db_url = "mongodb+srv://freelance-io-admin:freelance-io-admin@freelanceio-cluster.5hizeeq.mongodb.net/freelanceio-db?retryWrites=true&w=majority&appName=freelanceio-cluster";
mongoose.connect(db_url)
  .then((result) => {
    app.listen(port, () => {
       console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use(cors());

// Middleware to parse JSON data in request body
app.use(express.json());