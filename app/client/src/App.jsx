import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CTAButtons from './components/CTAButtons';
import ChatPage from './components/pages/ChatPage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      {/* Conditionally render Navbar and CTAButtons based on the current route */}
      <Routes>
        <Route path="/" element={<><Navbar /><HeroSection /><CTAButtons /></>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/welcome" element={<><Navbar /><WelcomeMessage username="Trader" /></>} />
      </Routes>
    </Router>
  );
}

export default App;