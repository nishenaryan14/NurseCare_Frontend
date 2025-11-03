'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageThread } from '@/components/chat/MessageThread';
import { VideoCallModal } from '@/components/video/VideoCallModal';
import { IncomingCallNotification } from '@/components/video/IncomingCallNotification';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useSocket } from '@/contexts/SocketContext';

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const { isConnected } = useSocket();
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>();
  const [selectedRecipient, setSelectedRecipient] = useState<{ name: string; role: string } | undefined>();

  // Auto-select conversation from URL parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId) {
      console.log('Auto-selecting conversation from URL:', conversationId);
      setSelectedConversationId(parseInt(conversationId));
    }
  }, [searchParams]);
  const { currentCall, incomingCall, startCall, endCall, acceptCall, rejectCall } = useVideoCall(selectedConversationId);

  const handleSelectConversation = (conversationId: number, recipientName?: string, recipientRole?: string) => {
    setSelectedConversationId(conversationId);
    if (recipientName && recipientRole) {
      setSelectedRecipient({ name: recipientName, role: recipientRole });
    }
  };

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
    <div className="fixed inset-0 flex flex-col bg-gray-100" style={{ top: '64px' }}>
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800 flex-shrink-0 z-20">
          ⚠️ Connecting to chat server...
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden bg-gray-100 p-2 md:p-3 gap-2 md:gap-3 min-h-0">
        {/* Conversation List - Hidden on mobile when conversation is selected */}
        <div className={`${
          selectedConversationId ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 flex-shrink-0 rounded-lg shadow-sm overflow-hidden`}>
          <ConversationList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
          />
        </div>

      {/* Message Thread */}
      <div className={`${
        selectedConversationId ? 'flex' : 'hidden md:flex'
      } flex-1 overflow-hidden bg-white rounded-lg shadow-sm`}>
        {selectedConversationId ? (
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Mobile back button */}
            <div className="md:hidden flex items-center gap-2 p-3 border-b bg-white flex-shrink-0 z-10">
              <button
                onClick={() => setSelectedConversationId(undefined)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-semibold text-gray-900">Back to conversations</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessageThread
                conversationId={selectedConversationId}
                onStartVideoCall={handleStartVideoCall}
                recipientName={selectedRecipient?.name}
                recipientRole={selectedRecipient?.role}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 w-full">
            <div className="text-center text-gray-500 px-4">
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
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100" style={{ top: '64px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}
