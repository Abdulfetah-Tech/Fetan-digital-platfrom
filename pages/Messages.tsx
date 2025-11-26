import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { Conversation } from '../types';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const Messages: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // Refresh conversations periodically to check for new messages
  useEffect(() => {
    if (!user) return;

    const fetchConvos = async () => {
      const data = await chatService.getConversations(user.id);
      setConversations(data);
      setLoadingList(false);
    };

    fetchConvos();
    const interval = setInterval(fetchConvos, 5000); // Poll for new convos
    return () => clearInterval(interval);
  }, [user]);

  const activeConversation = conversations.find(c => c.id === conversationId);

  const handleSelectConversation = (id: string) => {
    navigate(`/messages/${id}`);
  };

  const handleBackToList = () => {
    navigate('/messages');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-4 transition-colors duration-300 flex flex-col h-screen">
       <SEO title="Messages" />
       <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex-grow flex gap-6 overflow-hidden">
          
          {/* Conversation List Sidebar - Hidden on mobile if chat is open */}
          <div className={`w-full md:w-80 lg:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${conversationId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('messages.title')}</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-2">
              <ConversationList 
                conversations={conversations} 
                activeId={conversationId || null}
                onSelect={handleSelectConversation}
                loading={loadingList}
              />
            </div>
          </div>

          {/* Chat Window Area */}
          <div className={`flex-grow ${!conversationId ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
            {conversationId && activeConversation ? (
              <ChatWindow 
                conversationId={conversationId}
                currentUser={user}
                otherUser={activeConversation.otherUser}
                onBack={handleBackToList}
              />
            ) : (
              <div className="hidden md:flex flex-col items-center justify-center text-gray-400 bg-white dark:bg-gray-800 w-full h-full rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{t('messages.select_conversation')}</p>
              </div>
            )}
          </div>

       </div>
    </div>
  );
};

export default Messages;