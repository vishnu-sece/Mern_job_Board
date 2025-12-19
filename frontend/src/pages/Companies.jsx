const Companies = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Companies</h1>
          <p className="text-xl text-gray-600">Discover top companies hiring now</p>
        </div>

        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-gray-400 text-4xl">🏢</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Companies Directory</h3>
          <p className="text-gray-500">Coming soon! Browse companies and their job openings.</p>
        </div>
      </div>
    </div>
  );
};

export default Companies;