const dbService = require('../services/dbService');

const createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, experience, companyName } = req.body;
    
    const job = await dbService.createJob({
      title,
      description,
      skillsRequired,
      experience,
      companyName,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to create job' 
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await dbService.getAllJobs();
    res.json({
      success: true,
      data: jobs,
      message: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to fetch jobs' 
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await dbService.getJobById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Job not found' 
      });
    }

    res.json({
      success: true,
      data: job,
      message: null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to fetch job' 
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await dbService.getJobByIdRaw(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Job not found' 
      });
    }

    // Compare raw creator ID with current user ID
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        data: null, 
        message: 'Not authorized to update this job' 
      });
    }

    const updatedJob = await dbService.updateJob(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedJob,
      message: 'Job updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to update job' 
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await dbService.getJobByIdRaw(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'Job not found' 
      });
    }

    // Compare raw creator ID with current user ID
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        data: null, 
        message: 'Not authorized to delete this job' 
      });
    }

    await dbService.deleteJob(req.params.id);
    res.json({
      success: true,
      data: null,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Failed to delete job' 
    });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };