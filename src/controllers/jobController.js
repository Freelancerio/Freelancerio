// controllers/jobController.js

const Job = require('../models/Job');

// Add a new job
const addJob = async (req, res) => {
  try {
    const {
      client_id,
      job_title,
      job_description,
      job_requirements,
      job_category,
      total_pay,
    } = req.body;

    const newJob = new Job({
      client_id,
      job_title,
      job_description,
      job_requirements,
      job_category,
      total_pay,
    });

    const savedJob = await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: savedJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// get all the jobs

const allJobs = async (req, res) => {
    try {
      const jobs = await Job.find().populate('client_id', 'name email'); // Adjust fields as needed
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };
  

// Remove a job by ID
const removeJob = async (req, res) => {
  try {
    const { jobId } = req.body; 

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job removed successfully', job: deletedJob });
  } catch (error) {
    console.error('Error removing job:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get a single job by ID
const singleJob = async (req, res) => {
  try {
    const { jobId } = req.query; 

    const job = await Job.findById(jobId).populate('client_id'); 

    if (!job) {
      return res.status(404).json({ message: 'Job not found' , result : {} , error: "" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

module.exports = {addJob, removeJob, singleJob, allJobs };
