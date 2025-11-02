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

export const useMessaging = (conversationId?: number) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/messaging/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Listen for new messages
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

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
    };
  }, [socket, conversationId, fetchUnreadCount, fetchConversations]);

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

  return {
    messages,
    conversations,
    unreadCount,
    isTyping,
    loading,
    isConnected,
    sendMessage,
    sendTyping,
    fetchConversations,
    fetchMessages,
    createConversation,
    markAsRead,
    fetchUnreadCount,
  };
};
