const express = require('express');
const router = express.Router();

const { postApplication,userApplications } = require('../controllers/applicationController');
 
// Job routes
router.post('/applications', postApplication);
router.get('/applications/user/:user_id', userApplications);

module.exports = router; 