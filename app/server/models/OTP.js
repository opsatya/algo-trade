import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 180 // OTP expires after 3 minutes (180 seconds)
  }
});

const OTP = mongoose.model('OTP', OTPSchema);
export default OTP;