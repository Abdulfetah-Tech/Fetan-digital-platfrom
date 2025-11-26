import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { initializeChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from "@google/genai";
import SEO from '../components/SEO';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 Hi there! I'm Fetan AI, your home maintenance companion.\n\nWhether you're dealing with a leaky tap 💧, a flickering light 💡, or planning a renovation 🏠, I'm here to help! What can I do for you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const chat = initializeChatSession();
    if (chat) {
      chatRef.current = chat;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let responseText = '';
      let suggestion = undefined;
      
      if (chatRef.current) {
        try {
          const result = await chatRef.current.sendMessage({ message: userMsg.text });
          const rawText = result.text;
          if (rawText) {
            try {
              const parsed = JSON.parse(rawText);
              responseText = parsed.text;
              suggestion = parsed.suggestion;
            } catch (jsonError) {
              console.warn("Failed to parse JSON response:", jsonError);
              responseText = rawText; // Fallback to raw text if parsing fails
            }
          } else {
            responseText = "I couldn't generate a response.";
          }
        } catch (apiError) {
          console.error("Gemini API Error:", apiError);
          responseText = "Sorry, I encountered an error while processing your request. Please try again.";
        }
      } else {
        responseText = "I'm sorry, I can't connect to the AI service. Please check if your API key is configured correctly.";
      }
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        suggestion: suggestion,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, something went wrong. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 pt-20 transition-colors duration-300">
      <SEO title="AI Home Assistant" description="Get instant advice on home maintenance issues with our AI Assistant." />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden h-[80vh] flex flex-col ring-1 ring-gray-200/50 dark:ring-gray-700/50 transition-colors">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-6 flex items-center gap-4 shadow-md z-10">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl shadow-inner">
              <Sparkles className="text-yellow-300 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight">Smart Diagnostic Assistant</h1>
              <p className="text-primary-100 text-xs font-medium opacity-90">Powered by Gemini AI • Always available</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-gray-900 relative scroll-smooth transition-colors">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: 'gray' }}></div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-100 text-indigo-600 ring-2 ring-white dark:ring-gray-700 dark:bg-indigo-900 dark:text-indigo-300' 
                    : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white ring-2 ring-white dark:ring-gray-700'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-5 shadow-sm relative ${
                  msg.role === 'user' 
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tr-none border border-gray-100 dark:border-gray-700' 
                    : 'bg-white dark:bg-gray-800 border-l-4 border-l-primary-500 text-gray-700 dark:text-gray-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">{msg.text}</p>
                  
                  {/* Service Suggestion Chip */}
                  {msg.suggestion && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 animate-slide-up">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Recommended Service</p>
                      <Link 
                        to={`/services?category=${msg.suggestion}`}
                        className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-800 dark:hover:text-primary-200 transition-all border border-primary-100 dark:border-primary-800 shadow-sm hover:shadow-md group"
                      >
                        Find {msg.suggestion} Experts 
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}

                  <span className={`text-[10px] opacity-50 absolute bottom-1 ${msg.role === 'user' ? 'left-4' : 'right-4'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white dark:ring-gray-700">
                  <Bot size={20} />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 z-10 transition-colors">
            <form onSubmit={handleSend} className="relative flex items-end gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your issue (e.g., sink is leaking)..."
                  className="w-full pl-5 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all shadow-inner"
                />
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="p-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary-500/30 transform active:scale-95 flex-shrink-0"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 py-1.5 rounded-lg mx-auto w-fit px-3">
              <AlertTriangle size={12} className="text-amber-500" />
              <span>AI advice is for guidance. Always consult a professional for dangerous tasks.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;