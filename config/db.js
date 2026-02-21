const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.MYSQLHOST || '127.0.0.1', 
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'turaab2011',
  database: process.env.MYSQLDATABASE || 'testdb',
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
    setTimeout(testConnection, 4000); // Retry after 4s
  }
}

testConnection();

module.exports = db;
