const jwt = require('jsonwebtoken');
const User = require('../models/User');


// ── REGISTER ──────────────────────────────────────────────
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare plain text password directly
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET not configured' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    bio: req.user.bio || '',
    location: req.user.location || '',
  });
};

const updateProfile = async (req, res) => {
  const { name, email, bio, location, password } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.location = location !== undefined ? location : user.location;

    if (password) {
      user.password = password;
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      bio: updated.bio,
      location: updated.location,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
