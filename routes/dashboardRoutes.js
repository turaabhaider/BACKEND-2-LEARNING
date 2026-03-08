const express = require('express');
const router = express.Router();
//yeh bhi
const { getDashboard } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getDashboard);

module.exports = router;
