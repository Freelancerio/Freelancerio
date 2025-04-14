const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();



// import routes
const userRoutes = require('./routes/userRoutes');

//use routes
app.use('/user',userRoutes);

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