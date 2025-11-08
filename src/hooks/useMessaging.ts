'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import api from '@/lib/api';

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  type: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    role: string;
  };
}

interface Conversation {
  id: number;
  participants: any[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface UserStatus {
  userId: number;
  isOnline: boolean;
  lastSeen: Date;
}

export const useMessaging = (conversationId?: number) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStatuses, setUserStatuses] = useState<Map<number, UserStatus>>(new Map());

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/messaging/conversations');
      setConversations(response.data);
      
      // Fetch status for all participants after loading conversations
      if (socket && response.data.length > 0) {
        const currentUserId = parseInt(localStorage.getItem('userId') || '0');
        const allParticipantIds = new Set<number>();
        
        response.data.forEach((conv: any) => {
          conv.participants?.forEach((p: any) => {
            if (p.userId !== currentUserId) {
              allParticipantIds.add(p.userId);
            }
          });
        });
        
        if (allParticipantIds.size > 0) {
          console.log('Fetching status for participants:', Array.from(allParticipantIds));
          socket.emit('getOnlineStatus', { userIds: Array.from(allParticipantIds) });
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [socket]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (convId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/messaging/conversations/${convId}/messages`);
      // Backend returns DESC order, reverse to show oldest first
      const messagesData = Array.isArray(response.data) ? response.data.reverse() : [];
      setMessages(messagesData);
      console.log('Fetched messages:', messagesData.length);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Create or get conversation
  const createConversation = useCallback(async (otherUserId: number, bookingId?: number) => {
    try {
      const response = await api.post('/messaging/conversations', {
        otherUserId,
        bookingId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }, []);

  // Send message
  const sendMessage = useCallback((content: string, type: string = 'TEXT') => {
    if (!socket || !conversationId) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    socket.emit('sendMessage', {
      conversationId,
      senderId: parseInt(userId),
      content,
      type,
    });
  }, [socket, conversationId]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/messaging/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark messages as read
  const markAsRead = useCallback(async (convId: number) => {
    try {
      await api.post(`/messaging/conversations/${convId}/read`);
      
      // Update local state to mark messages as read
      setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
      
      // Refresh conversations to update unread counts
      fetchConversations();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [fetchConversations, fetchUnreadCount]);

  // Send typing indicator
  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socket || !conversationId) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    socket.emit('typing', {
      conversationId,
      userId: parseInt(userId),
      isTyping,
    });
  }, [socket, conversationId]);

  // Join conversation
  useEffect(() => {
    if (!socket || !conversationId) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    socket.emit('joinConversation', {
      conversationId,
      userId: parseInt(userId),
    });

    return () => {
      socket.emit('leaveConversation', { conversationId });
    };
  }, [socket, conversationId]);

  // Listen for new messages and status changes
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (conversationId && message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
        // Don't fetch unread count here - let the component handle marking as read
      } else {
        // Only update unread count if message is for a different conversation
        fetchUnreadCount();
        fetchConversations(); // Refresh conversation list to show new message
      }
    };

    const handleUserTyping = (data: { userId: number; isTyping: boolean }) => {
      setIsTyping(data.isTyping);
    };

    const handleStatusChange = (data: { userId: number; isOnline: boolean; lastSeen: Date }) => {
      console.log('Status changed:', data);
      setUserStatuses(prev => {
        const updated = new Map(prev);
        updated.set(data.userId, {
          userId: data.userId,
          isOnline: data.isOnline,
          lastSeen: new Date(data.lastSeen),
        });
        return updated;
      });
    };

    const handleMessagesRead = (data: { conversationId: number; readBy: number; timestamp: Date }) => {
      if (conversationId && data.conversationId === conversationId) {
        // Update messages to show as read
        setMessages(prev => prev.map(msg => ({
          ...msg,
          read: true,
        })));
      }
    };

    const handleRefreshMessages = () => {
      if (conversationId) {
        console.log('Refreshing messages due to call event');
        fetchMessages(conversationId);
      }
    };

    // Global handler for online statuses (from fetchConversations)
    const handleOnlineStatuses = (data: Array<{ id: number; isOnline: boolean; lastSeen: Date }> | any) => {
      console.log('Received online statuses (global):', data);
      
      // Handle both formats: direct array or wrapped in data property
      const statuses = Array.isArray(data) ? data : (data?.data || []);
      
      statuses.forEach((user: any) => {
        if (user && user.id) {
          setUserStatuses(prev => {
            const updated = new Map(prev);
            updated.set(user.id, {
              userId: user.id,
              isOnline: user.isOnline || false,
              lastSeen: new Date(user.lastSeen),
            });
            return updated;
          });
        }
      });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStatusChanged', handleStatusChange);
    socket.on('messagesRead', handleMessagesRead);
    socket.on('onlineStatuses', handleOnlineStatuses);
    socket.on('refreshMessages', handleRefreshMessages);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStatusChanged', handleStatusChange);
      socket.off('messagesRead', handleMessagesRead);
      socket.off('onlineStatuses', handleOnlineStatuses);
      socket.off('refreshMessages', handleRefreshMessages);
    };
  }, [socket, conversationId, fetchUnreadCount, fetchConversations, fetchMessages]);

  // Fetch initial data
  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [fetchConversations, fetchUnreadCount]);

  useEffect(() => {
    if (conversationId) {
      console.log('Loading conversation:', conversationId);
      fetchMessages(conversationId);
      // Don't auto-mark as read here - let the component handle it when messages are visible
    } else {
      setMessages([]); // Clear messages when no conversation selected
    }
  }, [conversationId]); // Remove fetchMessages from deps to avoid circular dependency

  // Fetch initial status for conversation participants
  useEffect(() => {
    if (!socket || !conversationId || !conversations.length) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const currentUserId = parseInt(localStorage.getItem('userId') || '0');
    const otherParticipants = conversation.participants
      .filter((p: any) => p.userId !== currentUserId)
      .map((p: any) => p.userId);

    if (otherParticipants.length > 0) {
      socket.emit('getOnlineStatus', { userIds: otherParticipants });
      
      // Listen for response
      const handleOnlineStatuses = (data: Array<{ id: number; isOnline: boolean; lastSeen: Date }> | any) => {
        console.log('Received online statuses:', data);
        
        // Handle both formats: direct array or wrapped in data property
        const statuses = Array.isArray(data) ? data : (data?.data || []);
        
        statuses.forEach((user: any) => {
          if (user && user.id) {
            setUserStatuses(prev => {
              const updated = new Map(prev);
              updated.set(user.id, {
                userId: user.id,
                isOnline: user.isOnline || false,
                lastSeen: new Date(user.lastSeen),
              });
              return updated;
            });
          }
        });
      };

      socket.on('onlineStatuses', handleOnlineStatuses);

      return () => {
        socket.off('onlineStatuses', handleOnlineStatuses);
      };
    }
  }, [socket, conversationId, conversations]);

  // Heartbeat to update activity
  useEffect(() => {
    if (!socket || !isConnected) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Send heartbeat every 30 seconds
    const interval = setInterval(() => {
      socket.emit('heartbeat', { userId: parseInt(userId) });
    }, 30000);

    return () => clearInterval(interval);
  }, [socket, isConnected]);

  return {
    messages,
    conversations,
    unreadCount,
    isTyping,
    loading,
    isConnected,
    userStatuses,
    sendMessage,
    sendTyping,
    fetchConversations,
    fetchMessages,
    createConversation,
    markAsRead,
    fetchUnreadCount,
  };
};
