const db = require('../config/db');

// Dashboard controller wali api interesting hai
const getDashboard = async (req, res) => {
  try {
    
    const userId = req.user.id;

   
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    const user = rows[0];

    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

   
    res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboard };
