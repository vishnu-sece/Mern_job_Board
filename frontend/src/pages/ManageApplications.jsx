import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const ManageApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: ''
  });

  useEffect(() => {
    fetchApplications();
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const res = await axios.get(`/api/jobs/${jobId}`);
      if (res.data.success) {
        setJob(res.data.data);
      } else {
        console.error('Failed to fetch job:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`/api/applications/job/${jobId}`);
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

  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) {
      return;
    }

    try {
      const res = await axios.put(`/api/applications/${applicationId}/status`, {
        status: 'rejected'
      });
      if (res.data.success) {
        fetchApplications();
      } else {
        alert(res.data.message || 'Failed to reject application');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject application');
    }
  };

  const handleGiveAppointment = (application) => {
    setSelectedApplication(application);
    setShowAppointmentModal(true);
  };

  const submitAppointment = async () => {
    if (!appointmentData.date || !appointmentData.time) {
      alert('Please select both date and time');
      return;
    }

    try {
      const res = await axios.put(`/api/applications/${selectedApplication._id}/status`, {
        status: 'selected',
        appointmentDate: appointmentData.date,
        appointmentTime: appointmentData.time
      });
      if (res.data.success) {
        setShowAppointmentModal(false);
        setAppointmentData({ date: '', time: '' });
        setSelectedApplication(null);
        fetchApplications();
      } else {
        alert(res.data.message || 'Failed to schedule appointment');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to schedule appointment');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Applications</h1>
          {job && (
            <p className="text-xl text-gray-600">{job.title} - {job.companyName}</p>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">Applications will appear here when candidates apply.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div key={application._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {application.candidateId?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{application.name}</h3>
                      <p className="text-gray-600">{application.email}</p>
                      <p className="text-gray-600">{application.phone}</p>
                    </div>
                  </div>
                  <span className={getStatusBadge(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map((skill, index) => (
                      <span key={index} className="badge-info text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {application.status === 'selected' && application.appointmentDate && (
                  <div className="mb-4 p-4 bg-green-50 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-2">Appointment Scheduled:</h4>
                    <p className="text-green-700">
                      Date: {new Date(application.appointmentDate).toLocaleDateString()}
                    </p>
                    <p className="text-green-700">Time: {application.appointmentTime}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <a
                    href={`http://localhost:5000/${application.resumePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Resume
                  </a>

                  {application.status === 'applied' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReject(application._id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200 font-medium"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleGiveAppointment(application)}
                        className="btn-primary"
                      >
                        Give Appointment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Schedule Appointment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    className="input-field"
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setAppointmentData({ date: '', time: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAppointment}
                  className="flex-1 btn-primary py-3"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;