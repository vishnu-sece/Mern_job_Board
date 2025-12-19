const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const net = require('net');
const { connectDB } = require('./config/db');

// Function to check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
};

// Load environment variables FIRST
dotenv.config();

// Initialize database connection (with fallback)
let dbInitialized = false;
const initializeDatabase = async () => {
  try {
    await connectDB();
    dbInitialized = true;
    console.log('🚀 Database initialization completed');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    dbInitialized = true; // Continue with fallback in development
  }
};

// Initialize database
initializeDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Debug routes only in development
if (process.env.NODE_ENV === 'development') {
  app.use('/api/debug', require('./routes/debugRoutes'));
}

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Always return consistent API response format
  const response = {
    success: false,
    data: null,
    message: 'Internal server error'
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    response.message = 'Validation failed';
    return res.status(400).json(response);
  }
  
  if (err.name === 'CastError') {
    response.message = 'Invalid ID format';
    return res.status(400).json(response);
  }
  
  if (err.code === 11000) {
    response.message = 'Duplicate entry';
    return res.status(400).json(response);
  }
  
  // Default error response
  res.status(500).json(response);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Check port availability and start server
const startServer = async () => {
  // Wait for database initialization
  while (!dbInitialized) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const available = await isPortAvailable(PORT);
  
  if (!available) {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('💡 Solutions:');
    console.error('   1. Stop the process using this port:');
    console.error(`      netstat -ano | findstr :${PORT}`);
    console.error('   2. Change PORT in .env file');
    console.error('   3. Kill the process: taskkill /PID <PID> /F');
    process.exit(1);
  }

  // Start server
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  return server;
};

// Start the server
startServer().then((server) => {
  // Handle server startup errors
  server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('\n🔄 SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});
