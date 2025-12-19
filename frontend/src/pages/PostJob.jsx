import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    experience: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const jobData = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim())
      };

      const response = await axios.post('/api/jobs', jobData);
      if (response.data.success) {
        navigate('/jobs');
      } else {
        setError(response.data.message || 'Failed to post job');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">+</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Post a New Job</h2>
            <p className="text-gray-600">Find the perfect candidate for your team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Job Title
              </label>
              <input
                name="title"
                type="text"
                required
                className="input-field"
                placeholder="e.g. Frontend Developer"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Company Name
              </label>
              <input
                name="companyName"
                type="text"
                required
                className="input-field"
                placeholder="e.g. Tech Corp"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Experience Required
              </label>
              <select
                name="experience"
                required
                className="input-field"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="">Select experience level</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Skills Required
              </label>
              <input
                name="skillsRequired"
                type="text"
                required
                className="input-field"
                placeholder="e.g. React, JavaScript, CSS (comma separated)"
                value={formData.skillsRequired}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                required
                rows="6"
                className="input-field resize-none"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Posting Job...</span>
                </div>
              ) : (
                'Post Job'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;