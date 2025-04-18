// routes/authRoutes.js

const express = require('express');
const router = express.Router();

const { googleLogin, githubLogin, microsoftLogin } = require('../controllers/userController');

// Auth routes
router.post('/google-auth', googleLogin);
router.post('/github-auth', githubLogin);
router.post('/microsoft-auth', microsoftLogin);

module.exports = router;

