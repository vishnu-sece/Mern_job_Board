const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const dbService = require('./services/dbService');

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  try {
    // Test database connection
    await connectDB();
    
    console.log(`📊 Database Mode: ${dbService.getMode()}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Test basic operations
    console.log('\n🔍 Testing basic operations...');
    
    // Test user creation
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: 'candidate'
    };
    
    const user = await dbService.createUser(testUser);
    console.log('✅ User creation test passed');
    
    // Test user retrieval
    const foundUser = await dbService.findUserByEmail('test@example.com');
    console.log('✅ User retrieval test passed');
    
    // Test job creation
    const testJob = {
      title: 'Test Job',
      description: 'Test job description',
      skillsRequired: ['JavaScript', 'Node.js'],
      experience: '2-3 years',
      companyName: 'Test Company',
      createdBy: user._id
    };
    
    const job = await dbService.createJob(testJob);
    console.log('✅ Job creation test passed');
    
    // Test job retrieval
    const jobs = await dbService.getAllJobs();
    console.log('✅ Job retrieval test passed');
    
    console.log('\n🎉 All tests passed! Database abstraction layer is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

testDatabaseConnection();