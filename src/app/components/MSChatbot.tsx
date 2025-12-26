import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, MessageSquare, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { getSession } from '../../lib/api';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MSChatbotProps {
  farmerName?: string;
  currentContext?: any; // To pass field info, weather, etc.
}

export function MSChatbot({ farmerName = 'Farmer', currentContext = {} }: MSChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Namaste ${farmerName}! I am MS, your farming assistant. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const sessionData = await getSession();
      const accessToken = sessionData?.session?.access_token || publicAnonKey;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: userMessage.text,
          context: {
            farmerName,
            ...currentContext
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply || "I'm having trouble understanding right now. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorText = await response.text();
        console.error('Chat API Error:', response.status, errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm currently offline or experiencing issues. Please check your connection.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isOpen ? 'bg-primary/0 pointer-events-none' : 'bg-gradient-to-tr from-primary to-emerald-600 text-white'
        }`}
      >
        <MessageSquare className="w-7 h-7" />
        {/* Notification Dot (optional logic could go here) */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[600px] max-h-[70vh] bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-emerald-600 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">MS</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-white/80 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-card border border-border rounded-tl-sm'
                  }`}>
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5 mb-1 opacity-70">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">MS AI</span>
                      </div>
                    )}
                    {msg.text}
                    <div className={`text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card border-t border-border shrink-0">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything about your crops..."
                  className="flex-1 bg-muted/50 border border-input focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md ${
                    !inputText.trim() || isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-muted-foreground/60">
                  AI responses can be inaccurate. Always verify with experts.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
