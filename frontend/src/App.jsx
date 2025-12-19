import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import About from './pages/About';
import PostJob from './pages/PostJob';
import ManageApplications from './pages/ManageApplications';
import AppliedJobs from './pages/AppliedJobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/post-job" element={
              <ProtectedRoute role="employer">
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/manage-applications/:jobId" element={
              <ProtectedRoute role="employer">
                <ManageApplications />
              </ProtectedRoute>
            } />
            <Route path="/applied-jobs" element={
              <ProtectedRoute role="candidate">
                <AppliedJobs />
              </ProtectedRoute>
            } />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;