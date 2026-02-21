const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    const token = authHeader.split(' ')[1];

    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const userId = decoded.id;

    
    const hashedToken = await bcrypt.hash(token, 10);
    await db.query(
      'INSERT INTO logged_out_tokens (user_id, token_hash, logout_time) VALUES (?, ?, NOW())',
      [userId, hashedToken]
    );

    res.status(200).json({ success: true, message: 'Logged out successfully' });

  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { logoutUser };