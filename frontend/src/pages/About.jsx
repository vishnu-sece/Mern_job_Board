const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About JobBoard</h1>
          <p className="text-xl text-gray-600">Connecting talent with opportunity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            JobBoard is dedicated to bridging the gap between talented professionals and innovative companies. 
            We believe that finding the right job or the perfect candidate should be simple, efficient, and rewarding.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">For Job Seekers</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Browse thousands of job opportunities</li>
                <li>• Easy application process</li>
                <li>• Track application status</li>
                <li>• Career guidance and resources</li>
              </ul>
            </div>
            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">For Employers</h3>
              <ul className="text-orange-700 space-y-1">
                <li>• Post jobs quickly and easily</li>
                <li>• Access to qualified candidates</li>
                <li>• Streamlined hiring process</li>
                <li>• Employer branding opportunities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;