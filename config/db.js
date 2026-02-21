const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.MYSQLHOST, 
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to database! Ab chala ja kaam.');
    connection.release();
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    // Removed auto-retry to prevent log spamming during crashes
  }
}

testConnection();

module.exports = db;