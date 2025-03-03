import { useState, useEffect, useRef } from "react";
import { Send, Bot, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../ui/Button";
import axios from "axios";

export const ChatInterface = () => {
  const { user, setIsAuthModalOpen, setAuthMode } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const fullPlaceholder = user 
    ? "Ask anything about trading..." 
    : "Sign in to start chatting...";

  useEffect(() => {
    // Get chat history from API when user logs in
    const fetchChatHistory = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/chat/history');
          setMessages(response.data.messages || []);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      }
    };
    
    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    // Animate placeholder text
    let index = 0;
    const interval = setInterval(() => {
      setTypedPlaceholder(fullPlaceholder.slice(0, index + 1));
      index++;
      if (index === fullPlaceholder.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullPlaceholder]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      setAuthMode('login');
      return;
    }

    if (input.trim()) {
      const userMessage = { text: input, isUser: true };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        // Send message to API
        const response = await axios.post('/api/chat/message', {
          message: input
        });
        
        // Add AI response to messages
        setMessages(prev => [...prev, { 
          text: response.data.reply, 
          isUser: false 
        }]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Add error message
        setMessages(prev => [...prev, { 
          text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
          isUser: false 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const UnauthorizedState = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-400">
      <Lock className="w-12 h-12 text-violet-500" />
      <p>Please sign in to start chatting with your AI trading assistant</p>
      <div className="flex gap-4">
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
            <>
              {messages.map((msg, index) => (
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
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-white/5 backdrop-blur-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={typedPlaceholder}
              disabled={!user || isLoading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!user || isLoading || !input.trim()}
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