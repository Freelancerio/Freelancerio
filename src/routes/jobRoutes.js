const express = require('express');
const router = express.Router();

const { addJob, removeJob, singleJob, allJobs, allJobsByUser, setIsHidden, updateJob,getClientId } = require('../controllers/jobController');

// Job routes
router.post('/add-job',addJob);
router.delete('/remove-job/:jobId',removeJob);
router.get('/single-job/:jobId',singleJob);
router.get('/all-jobs',allJobs);
router.get('/all-jobs/:userid',allJobsByUser);
router.get('/get-client-id/:jobId',getClientId);
router.put('/set-hidden-status/:jobId',setIsHidden);
router.put('/update-job/:jobId',updateJob);


module.exports = router;