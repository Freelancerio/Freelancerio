const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
