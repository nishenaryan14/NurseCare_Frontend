'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface StartChatButtonProps {
  otherUserId: number;
  otherUserName: string;
  bookingId?: number;
  variant?: 'primary' | 'secondary';
}

export const StartChatButton: React.FC<StartChatButtonProps> = ({
  otherUserId,
  otherUserName,
  bookingId,
  variant = 'primary',
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    try {
      setLoading(true);
      
      // Create or get existing conversation
      const response = await api.post('/messaging/conversations', {
        otherUserId,
        bookingId,
      });

      const conversation = response.data;
      
      // Redirect to messages page with the conversation selected
      router.push(`/messages?conversationId=${conversation.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = variant === 'primary'
    ? 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center gap-2'
    : 'px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 transition-colors flex items-center gap-2';

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className={buttonClasses}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {loading ? 'Starting...' : `Chat with ${otherUserName}`}
    </button>
  );
};
