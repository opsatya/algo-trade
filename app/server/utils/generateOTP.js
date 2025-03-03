// Define the generateOTP function
export const generateOTP = () => {
    // Generate a 8-character alphanumeric OTP
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    
    for (let i = 0; i < 8; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return otp;
};