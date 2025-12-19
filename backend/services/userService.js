const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isUsingMemoryDB, getMemoryDB } = require('../config/db');

class UserService {
  async createUser(userData) {
    const { name, email, password, role } = userData;
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    if (isUsingMemoryDB()) {
      // Check if user exists
      const existingUser = getMemoryDB().findUserByEmail(normalizedEmail);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user
      const user = getMemoryDB().createUser({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role
      });
      
      return user;
    } else {
      // Check if user exists
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create user (password will be hashed by mongoose pre-save hook)
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role
      });
      
      return user;
    }
  }

  async findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    if (isUsingMemoryDB()) {
      return getMemoryDB().findUserByEmail(normalizedEmail);
    } else {
      return await User.findOne({ email: normalizedEmail });
    }
  }

  async findUserById(id) {
    if (isUsingMemoryDB()) {
      return getMemoryDB().findUserById(id);
    } else {
      return await User.findById(id).select('-password');
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  removePassword(user) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserService();