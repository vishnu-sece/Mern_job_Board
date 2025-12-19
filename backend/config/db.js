const mongoose = require('mongoose');
const memoryDB = require('./memoryDB');
const dbService = require('../services/dbService');

let dbMode = 'memory';

const connectDB = async () => {
  // Single attempt to connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 10,
      bufferCommands: false,
    });
    
    dbMode = 'mongo';
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Running in MongoDB mode');
    dbService.setMode('mongo');
    
  } catch (error) {
    console.log('⚠️ MongoDB connection failed:', error.message);
    
    // Production environment requires MongoDB
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Production environment requires MongoDB connection');
      process.exit(1);
    }
    
    // Development fallback to in-memory
    dbMode = 'memory';
    console.log('📦 Falling back to In-Memory Database');
    console.log('📊 Running in In-Memory mode');
    memoryDB.connect();
    dbService.setMode('memory');
  }
};

const getDbMode = () => dbMode;

module.exports = { connectDB, getDbMode };