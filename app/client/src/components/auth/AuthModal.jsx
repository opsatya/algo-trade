import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../ui/Button';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      setShowOTPInput(true);
    } else {
      // Handle login
      setUser({ username: formData.username }); // Temporary for demo
      setIsAuthModalOpen(false);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    // Add OTP verification logic here
    setUser({ username: formData.username }); // Temporary for demo
    setIsAuthModalOpen(false);
  };

  const handleBack = () => {
    if (showOTPInput) {
      setShowOTPInput(false);
    } else {
      setIsAuthModalOpen(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 p-8 rounded-2xl border border-white/10 w-full max-w-md relative">
        {/* Back button */}
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-400 hover:text-white cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {showOTPInput ? 'Enter OTP' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
        </h2>

        {showOTPInput ? (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Enter the 8-character OTP sent to your email</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                placeholder="Enter OTP"
                maxLength={8}
              />
            </div>
            <Button type="submit" variant="primary" fullWidth>
              Verify OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  placeholder="Enter username"
                />
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    placeholder="Enter email"
                  />
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-gray-400 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                    placeholder="Confirm password"
                  />
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth>
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="text-gray-400">or</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                icon={<img src="/api/placeholder/20/20" alt="Google" className="w-5 h-5" />}
              >
                Continue with Google
              </Button>
              <Button
                variant="secondary"
                fullWidth
                icon={<img src="/api/placeholder/20/20" alt="GitHub" className="w-5 h-5" />}
              >
                Continue with GitHub
              </Button>
            </div>

            <p className="text-center text-gray-400 mt-4">
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-violet-500 hover:text-violet-400 cursor-pointer"
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;