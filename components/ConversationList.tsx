import React from 'react';
import { Conversation } from '../types';
import { Loader2, MessageSquare } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, activeId, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
           <MessageSquare size={24} />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No conversations yet.</p>
        <p className="text-xs text-gray-400 mt-1">Contact a provider to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((convo) => (
        <div 
          key={convo.id}
          onClick={() => onSelect(convo.id)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
            activeId === convo.id 
              ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
          }`}
        >
          <div className="relative flex-shrink-0">
             <img 
               src={convo.otherUser?.avatar || `https://ui-avatars.com/api/?name=${convo.otherUser?.name || 'User'}&background=random`} 
               alt={convo.otherUser?.name} 
               className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-700"
             />
             {convo.unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-900">
                 {convo.unreadCount}
               </span>
             )}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className={`text-sm font-bold truncate ${activeId === convo.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                {convo.otherUser?.name || 'Unknown User'}
              </h4>
              <span className="text-[10px] text-gray-400 flex-shrink-0">
                {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleDateString() : ''}
              </span>
            </div>
            <p className={`text-xs truncate ${convo.unreadCount > 0 ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
              {convo.lastMessage || 'Start a conversation'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;