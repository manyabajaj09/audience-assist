const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * Create user (admin or agent)
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ success: true, user });
  } catch (err) {
    console.error('POST /users error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * List all users
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
