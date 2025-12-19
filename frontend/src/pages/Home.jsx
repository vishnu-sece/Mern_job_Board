import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      const jobsData = res.data?.data || res.data || [];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Find Your
            <span className="text-primary-500"> Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of opportunities from top companies. Your next career move starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs" className="btn-primary text-lg px-8 py-4">
              Browse Jobs
            </Link>
            <Link to="/post-job" className="btn-secondary text-lg px-8 py-4">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-500 mb-2">10K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-secondary-500 mb-2">5K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-accent-500 mb-2">50K+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Opportunities</h2>
            <p className="text-xl text-gray-600">Handpicked jobs from top companies</p>
          </div>

          {jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.slice(0, 6).map((job) => (
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
                  
                  <Link
                    to={`/job/${job._id}`}
                    className="block w-full text-center btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : null}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gray-400 text-4xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Available</h3>
              <p className="text-gray-500">Check back soon for new opportunities!</p>
            </div>
          )}

          {jobs.length > 6 && (
            <div className="text-center mt-12">
              <Link to="/jobs" className="btn-secondary text-lg px-8 py-4">
                View All Jobs
              </Link>
            </div>
          )}
          
          {jobs.length === 0 && (
            <div className="text-center mt-12">
              <Link to="/jobs" className="btn-primary text-lg px-8 py-4">
                Browse All Jobs
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;