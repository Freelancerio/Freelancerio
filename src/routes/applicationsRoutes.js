const express = require('express');
const router = express.Router();

const { jobApply, getApplicants, checkApplicationStatus } = require('../controllers/applicationController');

// Job routes
router.post('/job-apply', jobApply);
router.get('/getApplicants/:jobId', getApplicants);
router.get('/check-status/:userId/:jobId', checkApplicationStatus);

module.exports = router;