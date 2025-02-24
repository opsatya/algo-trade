import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import { useAuth } from "./components/hooks/useAuth";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CTAButtons from "./components/CTAButtons";
import ChatPage from "./components/pages/ChatPage";
import { WelcomeMessage } from "./components/chat/WelcomeMessage";
import AuthModal from "./components/auth/AuthModal"; // ✅ Ensure AuthModal is globally available
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Layout Component
const AppLayout = ({ children, showNavbar = true }) => {
  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* ✅ AuthModal is now globally accessible */}
        <AuthModal />  

        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <AppLayout>
                <HeroSection />
                <CTAButtons />
              </AppLayout>
            } 
          />
          <Route 
            path="/chat" 
            element={<ChatPage />} // ✅ No need for ProtectedRoute, auth handled inside ChatPage
          />
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WelcomeMessage />
                </AppLayout>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
