// authRoute.js (in your server/routes folder)
import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../services/emailService.js';
import { authenticate } from '../middlewares/auth.js';

// SignUp
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already in use' : 'Username already taken'
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        const otp = generateOTP();

        await new OTP({ userId: user._id, email, otp }).save();

        const emailSent = await sendOTPEmail(email, otp);

        if (!emailSent) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
        }

        return res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
            userId: user._id
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const user = await User.findByIdAndUpdate(otpRecord.userId, { isVerified: true }, { new: true });

        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate token for auto-login after verification
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully',
            token, // Send token for frontend to store if needed
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({ success: false, message: 'Verification failed' });
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await OTP.deleteMany({ userId: user._id });

        const otp = generateOTP();

        await new OTP({ userId: user._id, email, otp }).save();

        const emailSent = await sendOTPEmail(email, otp);

        if (!emailSent) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
        }

        return res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({ success: false, message: 'Failed to resend OTP' });
    }
});

// Signin
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
              success: false, 
              message: 'Username/email and password are required' 
            });
          }
          
        // Check if username is actually an email
        const isEmail = username.includes('@');
        
        // Find user by username or email
        const user = await User.findOne(
            isEmail ? { email: username } : { username }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Email not verified',
                requireVerification: true,
                email: user.email
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Send token for frontend to store
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: 'Logout successful' });
});

export default router;