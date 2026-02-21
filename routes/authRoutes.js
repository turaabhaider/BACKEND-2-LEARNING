const express = require('express');
const router = express.Router();

const { signupUser, loginUser } = require('../controllers/authController');
const { logoutUser } = require('../controllers/logoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser); 

module.exports = router;