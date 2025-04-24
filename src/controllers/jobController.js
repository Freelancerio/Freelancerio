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
    const jobs = await Job.find().lean(); // Fetch jobs as plain JS objects

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



// const allJobs = async (req, res) => {
//   let data = [
//     {
//       "title": "UI/UX Designer for E-commerce Platform",
//       "company": "TechSolutions Inc.",
//       "location": "Remote",
//       "rate": "$40-60/hr",
//       "duration": "3-6 months",
//       "description": "Looking for an experienced UI/UX designer to redesign our e-commerce platform with a focus on user experience and conversion optimization.",
//       "skills": ["UI Design", "UX Research", "Figma", "Prototyping"]
//     },
//     {
//       "title": "Full-Stack Developer (React & Node.js)",
//       "company": "DevCore Labs",
//       "location": "New York, NY",
//       "rate": "$50-75/hr",
//       "duration": "6+ months",
//       "description": "We're seeking a full-stack developer to build scalable web applications using React and Node.js. Experience with REST APIs and MongoDB required.",
//       "skills": ["JavaScript", "React", "Node.js", "MongoDB"]
//     },
//     {
//       "title": "Content Writer for Tech Blog",
//       "company": "Inkwell Media",
//       "location": "Remote",
//       "rate": "$25-35/hr",
//       "duration": "Ongoing",
//       "description": "Join our content team to write high-quality blog posts, tutorials, and guides on software development and emerging tech.",
//       "skills": ["Technical Writing", "SEO", "Markdown", "Content Strategy"]
//     },
//     {
//       "title": "Mobile App QA Tester",
//       "company": "AppTesters Co.",
//       "location": "San Francisco, CA",
//       "rate": "$30-50/hr",
//       "duration": "3 months",
//       "description": "Seeking a detail-oriented QA tester for manual and automated testing of Android and iOS applications. Familiarity with Appium preferred.",
//       "skills": ["QA Testing", "Appium", "iOS", "Android", "Bug Reporting"]
//     }
//     ,
//     {
//       "title": "Mobile App QA Tester",
//       "company": "AppTesters Co.",
//       "location": "San Francisco, CA",
//       "rate": "$30-50/hr",
//       "duration": "3 months",
//       "description": "Seeking a detail-oriented QA tester for manual and automated testing of Android and iOS applications. Familiarity with Appium preferred.",
//       "skills": ["QA Testing", "Appium", "iOS", "Android", "Bug Reporting"]
//     }
//     ,
//     {
//       "title": "Mobile App QA Tester",
//       "company": "AppTesters Co.",
//       "location": "San Francisco, CA",
//       "rate": "$30-50/hr",
//       "duration": "3 months",
//       "description": "Seeking a detail-oriented QA tester for manual and automated testing of Android and iOS applications. Familiarity with Appium preferred.",
//       "skills": ["QA Testing", "Appium", "iOS", "Android", "Bug Reporting"]
//     }
//     ,
//     {
//       "title": "Mobile App QA Tester",
//       "company": "AppTesters Co.",
//       "location": "San Francisco, CA",
//       "rate": "$30-50/hr",
//       "duration": "3 months",
//       "description": "Seeking a detail-oriented QA tester for manual and automated testing of Android and iOS applications. Familiarity with Appium preferred.",
//       "skills": ["QA Testing", "Appium", "iOS", "Android", "Bug Reporting"]
//     }
//     ,
//     {
//       "title": "Mobile App QA Tester",
//       "company": "AppTesters Co.",
//       "location": "San Francisco, CA",
//       "rate": "$30-50/hr",
//       "duration": "3 months",
//       "description": "Seeking a detail-oriented QA tester for manual and automated testing of Android and iOS applications. Familiarity with Appium preferred.",
//       "skills": ["QA Testing", "Appium", "iOS", "Android", "Bug Reporting"]
//     }
//   ]

//   res.json(data);
  
// }  
  

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
