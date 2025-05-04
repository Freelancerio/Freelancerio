// controllers/jobController.js
const admin = require('../firebase/firebase.js');
const Job = require('../models/jobModel');

// Add a new job
const addJob = async (req, res) => {
  try {
    const {
      client_id,
      job_title,
      job_description,
      job_requirements,
      job_category,
      location_category,
      duration_months,
      total_pay,
      taken_status:taken_status
    } = req.body;

    console.log(req.body);

    const newJob = new Job({
      client_id,
      job_title,
      job_description,
      job_requirements,
      job_category,
      location_category,
      duration_months,
      total_pay,
      taken_status,
    });

    console.log(newJob);

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
    const jobs = await Job.find({ isHidden: false }).lean(); // Fetch jobs as plain JS objects

    const userCache = {}; // To prevent duplicate lookups

    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const uid = job.client_id;

        if (userCache[uid]) {
          return {
            ...job,
            company: userCache[uid]
          };
        }

        try {
          const user = await admin.auth().getUser(uid);
          const companyName = user.displayName || user.email || 'Unknown';
          userCache[uid] = companyName;

          return {
            ...job,
            company: companyName
          };
        } catch (error) {
          console.warn(`Error fetching user for UID ${uid}:`, error.message);
          return {
            ...job,
            company: 'Unknown'
          };
        }
      })
    );

    res.status(200).json(jobsWithCompany);
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// get all jobs by a specific user
const allJobsByUser = async (req, res) => {
  try {
    // Get the user ID from query or params
    const userId = req.params.userid || req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Only fetch jobs posted by this user
    const jobs = await Job.find({ client_id: userId }).lean();

    const userCache = {};

    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const uid = job.client_id;

        if (userCache[uid]) {
          return {
            ...job,
            company: userCache[uid]
          };
        }

        try {
          const user = await admin.auth().getUser(uid);
          const companyName = user.displayName || user.email || 'Unknown';
          userCache[uid] = companyName;

          return {
            ...job,
            company: companyName
          };
        } catch (error) {
          console.warn(`Error fetching user for UID ${uid}:`, error.message);
          return {
            ...job,
            company: 'Unknown'
          };
        }
      })
    );

    res.status(200).json(jobsWithCompany);
  } catch (error) {
    console.error('Error fetching jobs by user:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


//change the status of isHIdden, is it true then make it false else make it true
const setIsHidden = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Toggle the isHidden field
    job.isHidden = !job.isHidden;
    await job.save();

    res.status(200).json({
      message: `Job visibility updated successfully`,
      jobId: job._id,
      newStatus: job.isHidden
    });
  } catch (error) {
    console.error('Error toggling isHidden:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

  


// Get a single job by ID
const singleJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).lean(); // Use .lean() to get a plain JS object

    if (!job) {
      return res.status(404).json({ message: 'Job not found', result: {}, error: "" });
    }

    const uid = job.client_id;

    try {
      const user = await admin.auth().getUser(uid);
      const companyName = user.displayName || user.email || 'Unknown';

      job.company = companyName; // Add the company name directly to the job object
    } catch (error) {
      console.warn(`Error fetching user for UID ${uid}:`, error.message);
      job.company = 'Unknown';
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


// Remove a job by ID
const removeJob = async (req, res) => {
  try {
    const { jobId } = req.params; 

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


//function to update a job
const updateJob = async (req, res) =>{
  try {
    const { jobId} = req.params;
    const updateFields = req.body;
   

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateFields, { new: true });

    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }

};

const getClientId = async (req,res) => {
  try{
    const { jobId } = req.params; 
    const job = await Job.findById(jobId).lean();
    const clientId = job.client_id;
    res.status(200).json(clientId);
  }
  catch(error){
    res.status(500).json({message : 'Get client id request failed', error: error.message});
  }
}


module.exports = {addJob, removeJob, singleJob, allJobs, allJobsByUser , setIsHidden, updateJob,getClientId };
