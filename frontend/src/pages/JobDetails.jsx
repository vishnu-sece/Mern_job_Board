import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosConfig';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    resume: null
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.data);
      } else {
        console.error('Failed to fetch job:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resume: e.target.files[0]
    });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user.role !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }

    setApplying(true);

    try {
      const formData = new FormData();
      formData.append('name', applicationData.name);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('skills', applicationData.skills.split(',').map(s => s.trim()));
      formData.append('resume', applicationData.resume);

      const res = await axios.post(`/api/applications/apply/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        alert('Application submitted successfully!');
        navigate('/applied-jobs');
      } else {
        alert(res.data.message || 'Failed to submit application');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/jobs/${id}`);
      if (res.data.success) {
        alert('Job deleted successfully!');
        navigate('/jobs');
      } else {
        alert(res.data.message || 'Failed to delete job');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {job.companyName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                    <p className="text-xl text-gray-600 font-medium">{job.companyName}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="badge-success">Active</span>
                  <span className="badge-info">{job.experience}</span>
                  {isAuthenticated && user?.role === 'employer' && job.createdBy._id === user._id && (
                    <button
                      onClick={handleDeleteJob}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm"
                    >
                      Delete Job
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-3 text-blue-600">📋</span>
                Job Description
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Required Skills */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-3 text-sky-500">🛠️</span>
                Required Skills
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {job.skillsRequired.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-center font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Application Form */}
            {isAuthenticated && user?.role === 'candidate' && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-3 text-orange-500">📝</span>
                    Apply for this Position
                  </h2>
                  {!showApplication && (
                    <button
                      onClick={() => setShowApplication(true)}
                      className="btn-primary"
                    >
                      Start Application
                    </button>
                  )}
                </div>

                {showApplication && (
                  <form onSubmit={handleApply} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="input-field"
                          placeholder="Enter your full name"
                          value={applicationData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="input-field"
                          placeholder="Enter your email"
                          value={applicationData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="input-field"
                        placeholder="Enter your phone number"
                        value={applicationData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Your Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        name="skills"
                        required
                        className="input-field"
                        placeholder="React, JavaScript, Node.js, etc."
                        value={applicationData.skills}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Upload Resume (PDF only)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={applying}
                        className="flex-1 btn-primary py-4 text-lg font-semibold disabled:opacity-50"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowApplication(false)}
                        className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="card text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🔐</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Apply?</h3>
                  <p className="text-gray-600">Please login to submit your application</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Login to Apply
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💼</span>
                  <div>
                    <div className="text-gray-500 text-sm">Experience</div>
                    <div className="font-semibold text-gray-800">{job.experience}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <div className="text-gray-500 text-sm">Company</div>
                    <div className="font-semibold text-gray-800">{job.companyName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="text-gray-500 text-sm">Posted</div>
                    <div className="font-semibold text-gray-800">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Job */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Share this Job</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 px-4 rounded-xl transition-all duration-200 font-medium">
                  Share on LinkedIn
                </button>
                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 px-4 rounded-xl transition-all duration-200 font-medium">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;