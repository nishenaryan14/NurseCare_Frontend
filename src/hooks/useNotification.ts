'use client';

import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import toast from 'react-hot-toast';

export const useNotification = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      const currentUserId = parseInt(localStorage.getItem('userId') || '0');
      
      // Don't notify for own messages
      if (message.senderId === currentUserId) return;

      // Show toast notification
      toast.success(`New message from ${message.sender.name}`, {
        icon: '💬',
        duration: 4000,
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);
};
