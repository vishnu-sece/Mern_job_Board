const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbService = require('../services/dbService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'All fields are required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await dbService.findUserByEmail(normalizedEmail);
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'User already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await dbService.createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      },
      message: 'Registration successful'
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Registration failed' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'Email and password are required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await dbService.findUserByEmail(normalizedEmail);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        data: null, 
        message: 'Invalid email or password' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        data: null, 
        message: 'Invalid email or password' 
      });
    }

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      },
      message: 'Login successful'
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      data: null, 
      message: 'Login failed' 
    });
  }
};

module.exports = { register, login };