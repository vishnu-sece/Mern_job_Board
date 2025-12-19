const dbService = require('../services/dbService');

const applyForJob = async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body;
    const { jobId } = req.params;

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'Resume file is required' 
      });
    }

    // Check if job exists
    const job = await dbService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Job not found' 
      });
    }

    // Check for existing application
    const existingApplication = await dbService.findExistingApplication(jobId, req.user._id);
    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await dbService.createApplication({
      jobId,
      candidateId: req.user._id,
      name,
      email,
      phone,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      resumePath: req.file.path,
      status: 'applied'
    });

    return res.status(201).json({ 
      success: true, 
      data: application, 
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to submit application' 
    });
  }
};

const getCandidateApplications = async (req, res) => {
  try {
    const applications = await dbService.getApplicationsByCandidate(req.user._id);
    return res.json({ 
      success: true, 
      data: applications, 
      message: null 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to fetch applications' 
    });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and user owns it
    const job = await dbService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Job not found' 
      });
    }

    // Check authorization
    const jobCreatorId = job.createdBy._id || job.createdBy;
    if (jobCreatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        data: null, 
        message: 'Not authorized to view applications for this job' 
      });
    }

    const applications = await dbService.getApplicationsByJob(jobId);
    return res.json({ 
      success: true, 
      data: applications, 
      message: null 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to fetch job applications' 
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, appointmentDate, appointmentTime } = req.body;

    if (status === 'selected' && (!appointmentDate || !appointmentTime)) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'Appointment date and time are required for selected status' 
      });
    }

    // Find application and check authorization
    const application = await dbService.findApplicationById(id);
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Application not found' 
      });
    }

    // Check if user owns the job
    const jobCreatorId = application.jobId.createdBy || application.jobId._id;
    if (jobCreatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        data: null, 
        message: 'Not authorized to update this application' 
      });
    }

    // Update application status
    const updatedApplication = await dbService.updateApplicationStatus(id, status);
    
    return res.json({ 
      success: true, 
      data: updatedApplication, 
      message: 'Application status updated successfully' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to update application status' 
    });
  }
};

module.exports = {
  applyForJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus
};