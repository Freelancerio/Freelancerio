// server.mjs

import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { auth } from "express-oauth2-jwt-bearer";
import fs from "fs";

// Setup __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read config manually for nodemon usage
const authConfig = JSON.parse(fs.readFileSync(join(__dirname, "client/scripts", "auth_config.json")));

const app = express();

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`
});

app.use(express.static(join(__dirname, "client")));

app.get("/api/external", checkJwt, (req, res) => {
  res.send({ msg: "Your access token was validated successfully" });
});

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "client/scripts", "auth_config.json"));
});

app.get("/", (req, res) => {
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