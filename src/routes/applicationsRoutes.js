const express = require('express');
const router = express.Router();

const { jobApply, getApplicants } = require('../controllers/applicationController');

// Job routes
router.post('/job-apply',jobApply);
router.get('/getApplicants/:jobId', getApplicants);


module.exports = router;