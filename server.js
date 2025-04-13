const express = require("express");
const { join } = require("path");


const app = express();

const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./client/scripts/auth_config.json");

const checkJwt = auth({
    audience: authConfig.audience,
    issuerBaseURL: `https://${authConfig.domain}`
});

// Serve static files from the public folder
app.use(express.static(join(__dirname, "client")));

app.get("/api/external",checkJwt,(req, res) => {
    res.send({
        msg: "Your acces token was validated successfully"
    });
});

// Serve the Auth0 config JSON securely
app.get("/", (req, res) => {
  res.sendFile(join(__dirname,"client/scripts", "auth_config.json"));
});

// Serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "client/pages", "LoginPage.html")); 
});

app.use(function(err,req,res,next){
    if(err.name === "UnauthorizedError"){
        return res.status(401).send({msg : "Invalid token"});
    }

    next(err,req,res);
});


app.listen(3000, () => {
  console.log(" Application running on port 3000");
});