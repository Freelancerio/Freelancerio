const express = require('express');
const router = express.Router();

const { addJob, removeJob, singleJob, allJobs } = require('../controllers/jobController');

// Job routes
router.post('/add-job',addJob);
router.delete('/remove-job',removeJob);
router.get('/single-job',singleJob);
router.get('/all-jobs',allJobs);

module.exports = router;