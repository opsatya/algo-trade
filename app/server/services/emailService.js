import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for signing up! To complete your registration, please use the following verification code:</p>
          <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">${otp}</div>
          <p>This code will expire in 3 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = { sendOTPEmail };