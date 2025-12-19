const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const memoryDB = require('../config/memoryDB');

class DatabaseService {
  constructor() {
    this.mode = 'memory'; // Default to memory mode
  }

  setMode(mode) {
    this.mode = mode;
    console.log(`📊 Database Service: Running in ${mode.toUpperCase()} mode`);
  }

  getMode() {
    return this.mode;
  }

  // Wrapper for safe database operations
  async safeOperation(operation) {
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation failed:', error.message);
      throw new Error('Database operation failed');
    }
  }

  // User Operations
  async createUser(userData) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        const user = await User.create(userData);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        };
      } else {
        return memoryDB.createUser(userData);
      }
    });
  }

  async findUserByEmail(email) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await User.findOne({ email: email.toLowerCase().trim() });
      } else {
        return memoryDB.findUserByEmail(email);
      }
    });
  }

  async findUserById(id) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await User.findById(id);
      } else {
        return memoryDB.findUserById(id);
      }
    });
  }

  // Job Operations
  async createJob(jobData) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        const job = await Job.create(jobData);
        return await Job.findById(job._id).populate('createdBy', 'name email');
      } else {
        return memoryDB.createJob(jobData);
      }
    });
  }

  async getAllJobs() {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Job.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
      } else {
        return memoryDB.findAllJobs();
      }
    });
  }

  async getJobById(id) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Job.findById(id).populate('createdBy', 'name email');
      } else {
        return memoryDB.findJobById(id);
      }
    });
  }

  async getJobByIdRaw(id) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Job.findById(id);
      } else {
        return memoryDB.findJobByIdRaw(id);
      }
    });
  }

  async updateJob(id, updateData) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Job.findByIdAndUpdate(id, updateData, { new: true });
      } else {
        return memoryDB.updateJob(id, updateData);
      }
    });
  }

  async deleteJob(id) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Job.findByIdAndDelete(id);
      } else {
        return memoryDB.deleteJob(id);
      }
    });
  }

  // Application Operations
  async createApplication(appData) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Application.create(appData);
      } else {
        return memoryDB.createApplication(appData);
      }
    });
  }

  async getApplicationsByCandidate(candidateId) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Application.find({ candidateId })
          .populate('jobId', 'title companyName')
          .sort({ createdAt: -1 });
      } else {
        return memoryDB.findApplicationsByUser(candidateId);
      }
    });
  }

  async getApplicationsByJob(jobId) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Application.find({ jobId })
          .populate('candidateId', 'name email')
          .sort({ createdAt: -1 });
      } else {
        return memoryDB.findApplicationsByJob(jobId);
      }
    });
  }

  async updateApplicationStatus(id, status) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        const application = await Application.findById(id).populate('jobId');
        if (application) {
          application.status = status;
          await application.save();
          return application;
        }
        return null;
      } else {
        return memoryDB.updateApplication(id, { status });
      }
    });
  }

  async findApplicationById(id) {
    if (this.mode === 'mongo') {
      return await Application.findById(id).populate('jobId');
    } else {
      return memoryDB.findApplicationById(id);
    }
  }

  async findExistingApplication(jobId, candidateId) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Application.findOne({ jobId, candidateId });
      } else {
        const applications = memoryDB.findApplicationsByJob(jobId);
        return applications.find(app => app.candidateId === candidateId) || null;
      }
    });
  }

  async findApplicationById(id) {
    return this.safeOperation(async () => {
      if (this.mode === 'mongo') {
        return await Application.findById(id).populate('jobId');
      } else {
        const application = memoryDB.findApplicationById(id);
        if (application) {
          const job = memoryDB.findJobById(application.jobId);
          return {
            ...application,
            jobId: job
          };
        }
        return null;
      }
    });
  }
}

module.exports = new DatabaseService();