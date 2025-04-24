const Application = require("../models/applicationModel");

// POST /applications — Apply to a job
const postApplication = async (req, res) => {
  try {
    const { client_id, user_id, job_id } = req.body;

    if (!client_id || !user_id || !job_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Application.findOne({ client_id, user_id, job_id });
    if (existing) {
      return res.status(409).json({ message: "Application already exists." });
    }

    const application = await Application.create({ client_id, user_id, job_id });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to create application.", error });
  }
};

// GET /applications/user/:user_id — Fetch all applications by user
const userApplications = async (req, res) => {
  try {
    const { user_id } = req.params;

    const applications = await Application.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve applications.", error });
  }
};

module.exports = {
  postApplication,
  userApplications
};
