const jwt = require('jsonwebtoken');
const db = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    
    const [rows] = await db.query('SELECT token_hash FROM logged_out_tokens');
    for (let row of rows) {
      const match = await bcrypt.compare(token, row.token_hash);
      if (match) {
        return res.status(401).json({ success: false, message: 'Token has been logged out' });
      }
    }

    req.user = { id: decoded.id };
    next();

  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = authMiddleware;