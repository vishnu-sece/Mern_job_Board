import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      if (res.data.success) {
        setJobs(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/jobs/${jobId}`);
      if (res.data.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Job Opportunities</h1>
          <p className="text-xl text-gray-600">Find your perfect job match</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="card hover:scale-105 transition-transform duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {job.companyName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="badge-success">New</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-primary-500 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-3 font-medium">{job.companyName}</p>
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                {job.description}
              </p>
              
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="ml-2">{job.experience}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.slice(0, 3).map((skill, index) => (
                    <span key={index} className="badge-info text-xs">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{job.skillsRequired.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Link
                  to={`/job/${job._id}`}
                  className="block w-full text-center btn-primary"
                >
                  View Details
                </Link>
                {isAuthenticated && user?.role === 'employer' && job.createdBy._id === user._id && (
                  <>
                    <Link
                      to={`/manage-applications/${job._id}`}
                      className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition-all duration-200 font-medium"
                    >
                      Manage Applications
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition-all duration-200 font-medium"
                    >
                      Delete Job
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-4xl">💼</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Available</h3>
            <p className="text-gray-500">Check back soon for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;