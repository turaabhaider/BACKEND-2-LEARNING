const db = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generatetoken');
//signup api hai bhai google sai bhi lai skta
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const normalizedEmail = email.toLowerCase();

    
    const [existingUser] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, normalizedEmail, hashedPassword]
    );


    const token = generateToken(result.insertId, '2h');

  
    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        name,
        email: normalizedEmail
      }
    });

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
//wehsai yeh wali api bhi google sai lai skta magar logic should be good
const loginUser = async (req, res) => {
  try {
   
    const { email, password } = req.body;
   
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    
    const normalizedEmail = email.toLowerCase();

   
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    const user = rows[0];

   
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    
    const token = generateToken(user.id, '2h');

    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  signupUser,
  loginUser
};
