const express = require('express');
const { isUsingMemoryDB, getMemoryDB } = require('../config/db');
const User = require('../models/User');

const router = express.Router();

// Debug route to check database status
router.get('/status', async (req, res) => {
  try {
    if (isUsingMemoryDB()) {
      const memDB = getMemoryDB();
      const users = memDB.getAllUsers();
      res.json({
        database: 'Memory DB',
        userCount: memDB.getUserCount(),
        users: users.map(u => ({ id: u._id, email: u.email, name: u.name, role: u.role }))
      });
    } else {
      const userCount = await User.countDocuments();
      const users = await User.find({}, 'email name role').limit(10);
      res.json({
        database: 'MongoDB',
        userCount,
        users
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;