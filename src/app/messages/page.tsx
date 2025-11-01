'use client';

import React, { useState } from 'react';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageThread } from '@/components/chat/MessageThread';
import { VideoCallModal } from '@/components/video/VideoCallModal';
import { IncomingCallNotification } from '@/components/video/IncomingCallNotification';
import { useVideoCall } from '@/hooks/useVideoCall';

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>();
  const { currentCall, incomingCall, startCall, endCall, acceptCall, rejectCall } = useVideoCall(selectedConversationId);

  const handleStartVideoCall = async () => {
    try {
      await startCall();
    } catch (error) {
      console.error('Failed to start video call:', error);
      alert('Failed to start video call. Please try again.');
    }
  };

  const handleEndCall = async () => {
    if (currentCall) {
      await endCall(currentCall.id);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Conversation List */}
      <div className="w-1/3 border-r">
        <ConversationList
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      </div>

      {/* Message Thread */}
      <div className="flex-1">
        {selectedConversationId ? (
          <MessageThread
            conversationId={selectedConversationId}
            onStartVideoCall={handleStartVideoCall}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center text-gray-500">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-semibold">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Call Modal */}
      {currentCall && (
        <VideoCallModal
          roomName={currentCall.roomName}
          onEndCall={handleEndCall}
          isOpen={!!currentCall}
        />
      )}

      {/* Incoming Call Notification */}
      {incomingCall && (
        <IncomingCallNotification
          callerName="User" // You can fetch the caller's name from the API
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
    </div>
  );
}
