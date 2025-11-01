'use client';

import React from 'react';
import { useMessaging } from '@/hooks/useMessaging';

interface ConversationListProps {
  onSelectConversation: (conversationId: number) => void;
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
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">No conversations yet</p>
          <p className="text-sm">Start a conversation with a nurse or patient</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Messages</h2>
        {unreadCount > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const otherUser = getOtherParticipant(conversation);
          const lastMessage = getLastMessage(conversation);
          const isSelected = conversation.id === selectedConversationId;

          return (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {otherUser?.name || 'Unknown User'}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      {otherUser?.role}
                    </span>
                  </div>
                  {lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {lastMessage.content}
                    </p>
                  )}
                </div>
                {lastMessage && (
                  <span className="text-xs text-gray-500">
                    {new Date(lastMessage.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
