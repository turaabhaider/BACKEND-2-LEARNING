const app = require('./app');
const db = require('./config/db');
//server chalao
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try { 
    await db.getConnection();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

startServer();