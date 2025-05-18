const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema({
  client_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  job_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'applied',
    enum: ['applied', 'reviewed', 'accepted', 'rejected']
  }
}, { timestamps: true }); // This enables automatic createdAt and updatedAt fields

// Create a compound index to prevent duplicate applications
jobApplicationSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);