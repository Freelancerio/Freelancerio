const express = require('express');
const router = express.Router();

const { addJob, removeJob, singleJob, allJobs, allJobsByUser } = require('../controllers/jobController');

// Job routes
router.post('/add-job',addJob);
router.delete('/remove-job',removeJob);
router.get('/single-job/:jobId',singleJob);
router.get('/all-jobs',allJobs);
router.get('/all-jobs/:userid',allJobsByUser);

module.exports = router;