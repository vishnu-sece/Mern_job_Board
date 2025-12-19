const express = require('express');
const {
  applyForJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/apply/:jobId', protect, authorize('candidate'), upload.single('resume'), applyForJob);
router.get('/my-applications', protect, authorize('candidate'), getCandidateApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;