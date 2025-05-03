const express = require('express');
const router = express.Router();

const { jobApply } = require('../controllers/applicationController');

// Job routes
router.post('/job-apply',jobApply);


module.exports = router;