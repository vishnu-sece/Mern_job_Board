const { ObjectId } = require('mongodb');

class MemoryDB {
  constructor() {
    this.jobs = new Map();
    this.users = new Map();
    this.applications = new Map();
    this.isConnected = false;
  }

  connect() {
    this.isConnected = true;
    console.log('📦 In-Memory Database Connected Successfully');
  }

  // Job operations
  createJob(jobData) {
    const id = new ObjectId().toString();
    const job = {
      _id: id,
      ...jobData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.jobs.set(id, job);
    return job;
  }

  findAllJobs() {
    return Array.from(this.jobs.values())
      .map(job => {
        const creator = this.findUserById(job.createdBy);
        return {
          ...job,
          createdBy: creator ? { _id: creator._id, name: creator.name, email: creator.email } : null
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  findJobById(id) {
    const job = this.jobs.get(id);
    if (!job) return null;
    
    const creator = this.findUserById(job.createdBy);
    return {
      ...job,
      createdBy: creator ? { _id: creator._id, name: creator.name, email: creator.email } : null
    };
  }

  findJobByIdRaw(id) {
    return this.jobs.get(id) || null;
  }

  updateJob(id, updateData) {
    const job = this.jobs.get(id);
    if (job) {
      const updatedJob = { ...job, ...updateData, updatedAt: new Date() };
      this.jobs.set(id, updatedJob);
      return updatedJob;
    }
    return null;
  }

  deleteJob(id) {
    return this.jobs.delete(id);
  }

  // User operations
  createUser(userData) {
    const id = new ObjectId().toString();
    const user = {
      _id: id,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    return Array.from(this.users.values()).find(user => user.email === normalizedEmail) || null;
  }

  findUserById(id) {
    return this.users.get(id) || null;
  }

  // Application operations
  createApplication(appData) {
    const id = new ObjectId().toString();
    const application = {
      _id: id,
      ...appData,
      status: appData.status || 'applied',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.applications.set(id, application);
    return application;
  }

  updateApplication(id, updateData) {
    const application = this.applications.get(id);
    if (application) {
      const updatedApp = { ...application, ...updateData, updatedAt: new Date() };
      this.applications.set(id, updatedApp);
      return updatedApp;
    }
    return null;
  }

  findApplicationById(id) {
    return this.applications.get(id) || null;
  }

  findApplicationsByJob(jobId) {
    return Array.from(this.applications.values())
      .filter(app => app.jobId === jobId)
      .map(app => {
        const candidate = this.findUserById(app.candidateId);
        return {
          ...app,
          candidateId: candidate ? { _id: candidate._id, name: candidate.name, email: candidate.email } : null
        };
      });
  }

  findApplicationsByUser(candidateId) {
    return Array.from(this.applications.values())
      .filter(app => app.candidateId === candidateId)
      .map(app => {
        const job = this.findJobById(app.jobId);
        return {
          ...app,
          jobId: job ? { _id: job._id, title: job.title, companyName: job.companyName } : null
        };
      });
  }

  // Debug methods
  getAllUsers() {
    return Array.from(this.users.values());
  }

  getUserCount() {
    return this.users.size;
  }
}

module.exports = new MemoryDB();