const JobApplication = require('../models/applicationModel');

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

module.exports = {jobApply};