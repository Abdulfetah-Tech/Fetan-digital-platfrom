import { Conversation, DirectMessage, User, UserRole } from '../types';
import { supabase } from '../lib/supabaseClient';
import { userService } from './userService';

const CONVOS_KEY = 'fetan_conversations';
const MESSAGES_KEY = 'fetan_direct_messages';

export const chatService = {
  /**
   * Get all conversations for a specific user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    if (supabase) {
      // Supabase implementation would require a complex join or view
      // Simplified simulation for real DB:
      /*
      const { data } = await supabase
        .from('conversation_participants')
        .select('conversation_id, conversations(*)')
        .eq('user_id', userId);
      */
       // Returning mock for hybrid approach if Supabase tables aren't set up yet
       return []; 
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    const convosStr = localStorage.getItem(CONVOS_KEY);
    let convos: Conversation[] = convosStr ? JSON.parse(convosStr) : [];
    
    // Filter for current user
    const userConvos = convos.filter(c => c.participants.includes(userId));

    // Hydrate with other user details
    const hydratedConvos = await Promise.all(userConvos.map(async (c) => {
      const otherUserId = c.participants.find(p => p !== userId);
      const otherUser = otherUserId ? await userService.getUserById(otherUserId) : null;
      
      return {
        ...c,
        otherUser: otherUser ? {
          id: otherUser.id,
          name: otherUser.name,
          avatar: otherUser.avatar,
          role: otherUser.role
        } : undefined
      };
    }));

    return hydratedConvos.sort((a, b) => 
      new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
    );
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<DirectMessage[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) return [];
      
      return data.map((m: any) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        content: m.content,
        createdAt: m.created_at,
        read: m.read
      }));
    }

    const msgsStr = localStorage.getItem(MESSAGES_KEY);
    const allMsgs: DirectMessage[] = msgsStr ? JSON.parse(msgsStr) : [];
    return allMsgs.filter(m => m.conversationId === conversationId).sort((a,b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  /**
   * Send a message
   */
  async sendMessage(conversationId: string, senderId: string, content: string): Promise<DirectMessage> {
    if (supabase) {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        id: data.id,
        conversationId: data.conversation_id,
        senderId: data.sender_id,
        content: data.content,
        createdAt: data.created_at,
        read: false
      };
    }

    // Mock Implementation
    const newMessage: DirectMessage = {
      id: Math.random().toString(36).substr(2, 9),
      conversationId,
      senderId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Save Message
    const msgsStr = localStorage.getItem(MESSAGES_KEY);
    const allMsgs: DirectMessage[] = msgsStr ? JSON.parse(msgsStr) : [];
    allMsgs.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMsgs));

    // Update Conversation Last Message
    const convosStr = localStorage.getItem(CONVOS_KEY);
    let convos: Conversation[] = convosStr ? JSON.parse(convosStr) : [];
    const convoIndex = convos.findIndex(c => c.id === conversationId);
    if (convoIndex !== -1) {
      convos[convoIndex].lastMessage = content;
      convos[convoIndex].lastMessageAt = newMessage.createdAt;
      localStorage.setItem(CONVOS_KEY, JSON.stringify(convos));
    }

    // Simulate Automated Reply (For Demo Feel)
    this.simulateReply(conversationId);

    return newMessage;
  },

  /**
   * Create or retrieve existing conversation
   */
  async startConversation(currentUserId: string, targetUserId: string): Promise<string> {
    // 1. Check local storage first for mock
    const convosStr = localStorage.getItem(CONVOS_KEY);
    let convos: Conversation[] = convosStr ? JSON.parse(convosStr) : [];
    
    const existing = convos.find(c => 
      c.participants.includes(currentUserId) && c.participants.includes(targetUserId)
    );

    if (existing) return existing.id;

    // 2. Create new
    const newConvo: Conversation = {
      id: Math.random().toString(36).substr(2, 9),
      participants: [currentUserId, targetUserId],
      unreadCount: 0,
      lastMessage: '',
      lastMessageAt: new Date().toISOString()
    };
    
    convos.push(newConvo);
    localStorage.setItem(CONVOS_KEY, JSON.stringify(convos));
    return newConvo.id;
  },

  /**
   * Helper to simulate a reply in demo mode
   */
  async simulateReply(conversationId: string) {
    setTimeout(() => {
       const replies = [
         "Thanks for reaching out! I'm available.",
         "Could you send me a photo of the issue?",
         "I can come by tomorrow afternoon.",
         "That sounds good to me.",
         "Hello! How can I help you today?"
       ];
       const randomReply = replies[Math.floor(Math.random() * replies.length)];
       
       const convosStr = localStorage.getItem(CONVOS_KEY);
       let convos: Conversation[] = convosStr ? JSON.parse(convosStr) : [];
       const convo = convos.find(c => c.id === conversationId);
       
       if (!convo) return;
       const otherUser = convo.participants.find(p => p !== 'u1'); // Assuming u1 is current user for demo logic

       if (otherUser) {
          const replyMsg: DirectMessage = {
            id: Math.random().toString(36).substr(2, 9),
            conversationId,
            senderId: otherUser,
            content: randomReply,
            createdAt: new Date().toISOString(),
            read: false
          };
          
          const msgsStr = localStorage.getItem(MESSAGES_KEY);
          const allMsgs: DirectMessage[] = msgsStr ? JSON.parse(msgsStr) : [];
          allMsgs.push(replyMsg);
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMsgs));
          
          // Update convo
          const idx = convos.findIndex(c => c.id === conversationId);
          if (idx !== -1) {
            convos[idx].lastMessage = randomReply;
            convos[idx].lastMessageAt = replyMsg.createdAt;
            convos[idx].unreadCount = (convos[idx].unreadCount || 0) + 1;
            localStorage.setItem(CONVOS_KEY, JSON.stringify(convos));
          }
       }
    }, 3000);
  }
};