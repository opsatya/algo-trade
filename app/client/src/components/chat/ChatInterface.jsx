import { useState, useEffect } from "react";
import { Send, Bot, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../ui/Button";

export const ChatInterface = () => {
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth(); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const fullPlaceholder = user 
    ? "Ask anything about trading..." 
    : "Sign in to start chatting...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedPlaceholder(fullPlaceholder.slice(0, index + 1));
      index++;
      if (index === fullPlaceholder.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullPlaceholder]);

  const handleSend = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput("");
      // Add AI response logic here
    }
  };

  const UnauthorizedState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
      <Lock className="w-12 h-12 text-violet-500" />
      <p>Please sign in to start chatting with your AI trading assistant</p>
      <div className="flex gap-4"> {/* ✅ Wrapped buttons inside a div for proper layout */}
        <Button
          onClick={() => { 
            setAuthMode("login"); 
            setIsAuthModalOpen(true); 
          }}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90 transition-opacity"
        >
          Sign In
        </Button>
        <Button
          onClick={() => { 
            setAuthMode("signup"); 
            setIsAuthModalOpen(true);
          }}
          variant="secondary"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
      <Bot className="w-12 h-12 text-violet-500" />
      <p>Start a conversation with your AI trading assistant</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
      <div className="h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!user ? (
            <UnauthorizedState />
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.isUser
                      ? "bg-gradient-to-r from-blue-500/20 to-violet-500/20 backdrop-blur-sm border border-white/10"
                      : "bg-white/5 backdrop-blur-sm"
                  }`}
                >
                  <p className={`text-${msg.isUser ? "white" : "gray-200"}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={typedPlaceholder}
              disabled={!user}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!user}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
