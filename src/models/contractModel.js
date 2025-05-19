const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  client_id: {
    type: String,
    ref: 'User',
    required: true
  },
  freelancer_id: {
    type: String,
    ref: 'User',
    required: true
  },
  job_id: {
    type: String,
    ref: 'Job',
    required: true
  },
  contract_terms: {
    type: String,
    required: true // This is what the client writes
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
