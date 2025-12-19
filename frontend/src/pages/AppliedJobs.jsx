import { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/applications/my-applications');
      if (res.data.success) {
        setApplications(res.data.data || []);
      } else {
        console.error('Failed to fetch applications:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return 'badge-info';
      case 'selected':
        return 'badge-success';
      case 'rejected':
        return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium';
      default:
        return 'badge-info';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'selected':
        return 'Selected for Interview';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Applied';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Applications</h1>
          <p className="text-xl text-gray-600">Track your job application status</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-4xl">📄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">Start applying for jobs to see your applications here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {application.jobId?.companyName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{application.jobId?.title}</h3>
                      <p className="text-gray-600 font-medium">{application.jobId?.companyName}</p>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={getStatusBadge(application.status)}>
                    {getStatusText(application.status)}
                  </span>
                </div>

                {application.status === 'selected' && application.appointmentDate && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <span className="mr-2">🎉</span>
                      Congratulations! Interview Scheduled
                    </h4>
                    <div className="space-y-1">
                      <p className="text-green-700">
                        <span className="font-medium">Date:</span> {new Date(application.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-green-700">
                        <span className="font-medium">Time:</span> {application.appointmentTime}
                      </p>
                    </div>
                  </div>
                )}

                {application.status === 'rejected' && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700">
                      Unfortunately, your application was not selected for this position. 
                      Keep applying - the right opportunity is waiting for you!
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Status updated: {new Date(application.updatedAt).toLocaleDateString()}
                  </div>
                  
                  {application.status === 'applied' && (
                    <div className="text-sm text-blue-600 font-medium">
                      Under Review
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;