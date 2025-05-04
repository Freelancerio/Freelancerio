const JobApplication = require('../models/applicationModel');
const { getUserDetailsById } = require('./helper');

const jobApply = async (req,res) => {
    try {
        const {
            client_id,
            user_id,
            job_id
        } = req.body;
        
        const newApplication = new JobApplication({
            client_id,
            user_id,
            job_id
        });
        const savedApplication = await newApplication.save();
        res.status(201).json({message: 'Applied successfully',savedApplication});
    }
    catch(error){
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};


const getApplicants = async (req, res) => {
    try {
      const { jobId } = req.params;
  
      if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required' });
      }
      
      const applications = await JobApplication.find({ job_id: jobId });
  
      const detailedApplicants = await Promise.all(
        applications.map(async (app) => {
          const user = await getUserDetailsById(app.user_id);
          return {
            _id: app._id,
            client_id: app.client_id,
            job_id: app.job_id,
            user_id: app.user_id,
            user: user || { displayName: 'Unknown', email: '', photoURL: '' }
          };
        })
      );
  
      res.status(200).json(detailedApplicants);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {jobApply, getApplicants};