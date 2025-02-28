import User from '../models/user.js'; // Updated to include .js extension
import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../services/emailService.js';
import crypto  from 'crypto';

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // If user exists but not verified, update their info
    if (user && !user.isVerified) {
      user.name = name;
      user.password = password;
      await user.save();
    } else {
      // Create new user (not verified yet)
      user = await User.create({
        name,
        email,
        password,
        isVerified: false
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Hash OTP before saving to database
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Save OTP to database
    await OTP.findOneAndDelete({ email }); // Remove any existing OTPs
    await OTP.create({
      email,
      otp: hashedOTP
    });

    // Send OTP to user's email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Hash the provided OTP for comparison
    const hashedOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');

    // Find the OTP in the database
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Verification code expired or invalid'
      });
    }

    // Check if OTP matches
    if (otpRecord.otp !== hashedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Mark user as verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    await user.save();

    // Delete the OTP record
    await OTP.findOneAndDelete({ email });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};