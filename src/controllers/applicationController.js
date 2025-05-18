const JobApplication = require('../models/applicationModel');
const { getUserDetailsById } = require('./helper');

const jobApply = async (req,res) => {
    try {
        const {
            client_id,
            user_id,
            job_id
        } = req.body;

        // Check if user has already applied for this job
        const existingApplication = await JobApplication.findOne({
            user_id,
            job_id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const newApplication = new JobApplication({
            client_id,
            user_id,
            job_id
        });
        const savedApplication = await newApplication.save();
        res.status(201).json({message: 'Applied successfully', savedApplication});
    }
    catch(error){
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Add a new function to check if user has already applied
const checkApplicationStatus = async (req, res) => {
    try {
        const { userId, jobId } = req.params;

        if (!userId || !jobId) {
            return res.status(400).json({ message: 'User ID and Job ID are required' });
        }

        const application = await JobApplication.findOne({
            user_id: userId,
            job_id: jobId
        });

        // Add more detailed response with timestamp
        res.status(200).json({
            hasApplied: !!application,
            application: application ? {
                id: application._id,
                timestamp: application.createdAt || application._id.getTimestamp(),
                status: 'applied'
            } : null
        });
    } catch (error) {
        console.error('Error checking application status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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

// New function to get all applications for a specific user
const getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const applications = await JobApplication.find({ user_id: userId });

        // Return detailed application information including status
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching user applications:', error);
        res.status(500).json({ message: 'Failed to fetch user applications', error: error.message });
    }
};

// Update application status (for client to accept/reject applications)
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        if (!applicationId) {
            return res.status(400).json({ message: 'Application ID is required' });
        }

        if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Valid status is required (pending, accepted, rejected)' });
        }

        const application = await JobApplication.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        application.updatedAt = new Date();

        const updatedApplication = await application.save();

        res.status(200).json({
            message: 'Application status updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Failed to update application status', error: error.message });
    }
};

// Get application statistics for a user
const getUserApplicationStats = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const applications = await JobApplication.find({ user_id: userId });

        // Calculate statistics
        const totalApplications = applications.length;
        const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
        const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
        const pendingApplications = applications.filter(app => app.status === 'pending').length;

        const successRate = totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0;

        res.status(200).json({
            totalApplications,
            acceptedApplications,
            rejectedApplications,
            pendingApplications,
            successRate
        });
    } catch (error) {
        console.error('Error fetching application statistics:', error);
        res.status(500).json({ message: 'Failed to fetch application statistics', error: error.message });
    }
};

// Delete an application
const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        if (!applicationId) {
            return res.status(400).json({ message: 'Application ID is required' });
        }

        const application = await JobApplication.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await JobApplication.findByIdAndDelete(applicationId);

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Failed to delete application', error: error.message });
    }
};

// Get applications for a specific job with detailed user information
const getJobApplicationsWithDetails = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        const applications = await JobApplication.find({ job_id: jobId });

        const detailedApplications = await Promise.all(
            applications.map(async (app) => {
                const user = await getUserDetailsById(app.user_id);
                return {
                    _id: app._id,
                    client_id: app.client_id,
                    job_id: app.job_id,
                    user_id: app.user_id,
                    status: app.status || 'pending',
                    createdAt: app.createdAt || app._id.getTimestamp(),
                    updatedAt: app.updatedAt,
                    user: user || { displayName: 'Unknown', email: '', photoURL: '' }
                };
            })
        );

        res.status(200).json(detailedApplications);
    } catch (error) {
        console.error('Error fetching job applications with details:', error);
        res.status(500).json({ message: 'Failed to fetch job applications', error: error.message });
    }
};

module.exports = {
    jobApply,
    getApplicants,
    checkApplicationStatus,
    getUserApplications,
    updateApplicationStatus,
    getUserApplicationStats,
    deleteApplication,
    getJobApplicationsWithDetails
};