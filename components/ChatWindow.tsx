import React, { useState, useEffect, useRef } from 'react';
import { DirectMessage, User } from '../types';
import { chatService } from '../services/chatService';
import { Send, Loader2, MoreVertical, Phone, Video } from 'lucide-react';

interface ChatWindowProps {
  conversationId: string;
  currentUser: User;
  otherUser?: { name: string; avatar?: string; id: string };
  onBack?: () => void; // For mobile view
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, currentUser, otherUser, onBack }) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages in mock mode (Simulating real-time socket)
  useEffect(() => {
    let interval: any;

    const fetchMessages = async () => {
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
      setLoading(false);
    };

    fetchMessages();
    
    // Polling every 2 seconds to check for "simulated" replies
    interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempContent = newMessage;
    setNewMessage(''); // Optimistic clear
    setSending(true);

    try {
      await chatService.sendMessage(conversationId, currentUser.id, tempContent);
      // Fetch immediately to show update
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to send", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden text-gray-500 mr-2">
              ←
            </button>
          )}
          <div className="relative">
            <img 
              src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${otherUser?.name || 'User'}&background=random`} 
              alt={otherUser?.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{otherUser?.name}</h3>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Video size={18} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-950/30">
        {loading ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Loading chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>No messages yet.</p>
            <p className="text-sm">Say hello to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                    isMe 
                      ? 'bg-primary-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white placeholder-gray-400"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || sending}
          className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;