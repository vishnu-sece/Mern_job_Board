const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  skills: [{
    type: String,
    required: true
  }],
  resumePath: {
    type: String,
    required: [true, 'Resume is required']
  },
  status: {
    type: String,
    enum: ['applied', 'selected', 'rejected'],
    default: 'applied'
  },
  appointmentDate: {
    type: String,
    required: false
  },
  appointmentTime: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);