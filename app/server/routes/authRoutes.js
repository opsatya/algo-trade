import express from 'express';
import { register, verifyOTP, login, getMe } from '../controllers/authController.js';
import { protect } from'../middlewares/auth.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Verify OTP route
router.post('/verify-otp', verifyOTP);

// Login route
router.post('/login', login);

// Get current user route
router.get('/me', protect, getMe);

module.exports = router;