"use client"

import { useEffect, useState } from "react";

export const WelcomeMessage = ({ username = "Trader" }) => {
  const [greeting, setGreeting] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const fullMessage = "Your personal AI trading assistant is ready to help";

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
    };
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedMessage(fullMessage.slice(0, index + 1));
      index++;
      if (index === fullMessage.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-3 mb-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
        {greeting}, {username}
      </h1>
      <p className="text-gray-400">{typedMessage}</p>
    </div>
  );
};