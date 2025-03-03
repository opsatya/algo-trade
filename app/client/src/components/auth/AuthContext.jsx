import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// In your AuthProvider.jsx
axios.defaults.baseURL = 'http://localhost:5000';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(true);
  
  // Set base URL for axios to match your backend routes
  // If your backend routes don't have /api prefix, remove it here
  // axios.defaults.baseURL = '/api'; // Uncomment if you have a proxy or backend at /api

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Configure axios to send the token with every request
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token and get user data - using /me endpoint instead of /verify
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // Map email to username for the backend if needed
      const loginData = {
        username: credentials.email, // Backend expects username
        password: credentials.password
      };
      
      const response = await axios.post('/api/auth/signin', loginData);
      
      // The backend sets token as HTTP-only cookie, so we don't need to store it
      // If your backend sends token in response body, uncomment these:
      // const { token } = response.data;
      // localStorage.setItem('token', token);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user in state
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      // Make sure all fields are present
      const { username, email, password } = userData;
      if (!username || !email || !password) {
        return {
          success: false,
          message: 'All fields are required'
        };
      }
      
      const response = await axios.post('/api/auth/signup', userData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      
      // After verification, we need to log in the user
      // If your verify-otp endpoint doesn't return a token, you'll need to login after verification
      if (response.data.success) {
        // You may need to auto-login here instead of expecting a token from verify-otp
        return { success: true, message: response.data.message };
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call the backend logout endpoint to clear the cookie
      await axios.post('/api/auth/logout');
      
      // Remove token from localStorage if you're using it
      localStorage.removeItem('token');
      
      // Remove auth header
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        loading,
        login,
        signup,
        verifyOTP,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};