'use client';

import React from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { ConversationListSkeleton } from './LoadingSkeleton';

interface ConversationListProps {
  onSelectConversation: (conversationId: number, recipientName?: string, recipientRole?: string) => void;
  selectedConversationId?: number;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedConversationId,
}) => {
  const { conversations, unreadCount, loading } = useMessaging();

  const getOtherParticipant = (conversation: any) => {
    const currentUserId = parseInt(localStorage.getItem('userId') || '0');
    return conversation.participants.find((p: any) => p.userId !== currentUserId)?.user;
  };

  const getLastMessage = (conversation: any) => {
    return conversation.messages[0];
  };

  if (loading) {
    return <ConversationListSkeleton />;
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="p-3 md:p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-white">Messages</h2>
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500 max-w-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2 text-gray-900">No conversations yet</p>
            <p className="text-sm mb-4 text-gray-600">Start chatting with nurses or patients from your bookings</p>
            <a 
              href="/patient/bookings" 
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
            >
              View My Bookings
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getUnreadCount = (conversation: any) => {
    const currentUserId = parseInt(localStorage.getItem('userId') || '0');
    return conversation.messages?.filter((msg: any) => 
      !msg.read && msg.senderId !== currentUserId
    ).length || 0;
  };

  return (
    <div className="flex flex-col h-full bg-white w-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-white">Messages</h2>
          {unreadCount > 0 && (
            <span className="px-2 md:px-3 py-1 text-xs bg-white text-blue-600 rounded-full font-semibold shadow-sm">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
        {conversations.map((conversation) => {
          const otherUser = getOtherParticipant(conversation);
          const lastMessage = getLastMessage(conversation);
          const isSelected = conversation.id === selectedConversationId;
          const unreadInConv = getUnreadCount(conversation);

          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id, otherUser?.name, otherUser?.role)}
              className={`p-3 md:p-4 border-b cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500 shadow-sm' 
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2 md:gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-semibold text-base md:text-lg shadow-md ${
                    otherUser?.role === 'NURSE' 
                      ? 'bg-gradient-to-br from-green-400 to-green-600' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    {otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${unreadInConv > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                        {otherUser?.name || 'Unknown User'}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        otherUser?.role === 'NURSE' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {otherUser?.role}
                      </span>
                    </div>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {lastMessage ? (
                      <p className={`text-sm truncate ${
                        unreadInConv > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No messages yet</p>
                    )}
                    
                    {unreadInConv > 0 && (
                      <span className="ml-2 flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadInConv > 9 ? '9+' : unreadInConv}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
