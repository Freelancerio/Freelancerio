// Fix the import for express-openid-connect
import pkg from "express-openid-connect";
const { auth: openidAuth, requiresAuth } = pkg;
import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { auth as jwtAuth } from "express-oauth2-jwt-bearer";
import fs from "fs";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js"

const port = 3000;



//this is the connection url to the database
const db_url = "mongodb+srv://freelance-io-admin:freelance-io-admin@freelanceio-cluster.5hizeeq.mongodb.net/freelanceio-db?retryWrites=true&w=majority&appName=freelanceio-cluster";
mongoose.connect(db_url)
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));


// Setup __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read config manually for nodemon usage
const authConfig = JSON.parse(fs.readFileSync(join(__dirname, "client/scripts", "auth_config.json")));

const app = express();

// import routes
app.use('/user',userRoutes);

const checkJwt = jwtAuth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`
});

// Making our application a MultiPage Application (MPA) by serving static files
const config = {
  authRequired: false,
  auth0Logout: false,
  secret: `cab12c9996648346d19436a8bd00382b47849709472b3e6e2d6e08123bf391bc0d423aaa2723306e1601ece8ceaf2a9e6181513a8a00ad44fbe1060f9ec75f39ce894`,
  baseURL: 'http://localhost:3000',
  clientID: 'c3vURHxgT8yWRge4sKT6LL9UZgOUuv0I',
  issuerBaseURL: 'https://dev-skmunlptv2i34eut.us.auth0.com'
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(openidAuth(config));
app.use(cors());

// Serve static files
app.use(express.static(join(__dirname, "client")));

// Modified root route to handle redirection after login
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // Redirect to dashboard or home page after successful login
    res.redirect('/userInfo');
  } else {
    // Show login page if not authenticated
    res.sendFile(join(__dirname, "client/pages", "LoginPage.html"));
  }
});

// Dashboard route that requires authentication
app.get('/dashboard', requiresAuth(), (req, res) => {
  res.sendFile(join(__dirname, "client/pages", "userdashboard.html"));
});

// Dashboard route that requires authentication
app.get('/userInfo', requiresAuth(), (req, res) => {
  res.sendFile(join(__dirname, "client/pages", "userInfo.html"));
});



// Profile route to access user information
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({ msg: "Your access token was validated successfully" });
});

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "client/scripts", "auth_config.json"));
});

app.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "client/pages", "LoginPage.html"));
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }
  next(err);
});

app.listen(3000, () => {
  console.log("Application running on port 3000");
});

// Middleware to parse JSON data in request body
app.use(express.json());