'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import EmojiPicker from '@/components/chat/EmojiPicker';
import { FileUploadZone } from '@/components/files/FileUploadZone';
import { FileGallery } from '@/components/files/FileGallery';
import { FileLightbox } from '@/components/files/FileLightbox';

interface MessageThreadProps {
  conversationId: number;
  onStartVideoCall: () => void;
  recipientName?: string;
  recipientRole?: string;
  recipientId?: number;
  onBack?: () => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  conversationId,
  onStartVideoCall,
  recipientName,
  recipientRole,
  recipientId,
  onBack,
}) => {
  const { messages, isTyping, sendMessage, sendTyping, loading, markAsRead, fetchUnreadCount, userStatuses } = useMessaging(conversationId);
  const [messageInput, setMessageInput] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFilePanel, setShowFilePanel] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  // Get recipient status
  const recipientStatus = recipientId ? userStatuses.get(recipientId) : null;

  // Helper function to format last seen
  const formatLastSeen = (lastSeen: Date | null) => {
    if (!lastSeen) return 'Offline';
    
    const now = new Date();
    const diff = now.getTime() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(lastSeen).toLocaleDateString();
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when they're visible and user is viewing the conversation
  useEffect(() => {
    if (!conversationId || messages.length === 0) return;

    // Check if there are any unread messages from others
    const hasUnreadMessages = messages.some(
      msg => !msg.read && msg.senderId !== currentUserId
    );

    if (!hasUnreadMessages) {
      setHasMarkedAsRead(false);
      return;
    }

    // Mark as read after a short delay (user has actually seen the messages)
    const timer = setTimeout(async () => {
      if (!hasMarkedAsRead) {
        await markAsRead(conversationId);
        fetchUnreadCount(); // Update badge immediately
        setHasMarkedAsRead(true);
      }
    }, 1000); // 1 second delay to ensure user is actually viewing

    return () => clearTimeout(timer);
  }, [conversationId, messages, currentUserId, hasMarkedAsRead, markAsRead, fetchUnreadCount]);

  // Reset hasMarkedAsRead when conversation changes
  useEffect(() => {
    setHasMarkedAsRead(false);
  }, [conversationId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput.trim());
    setMessageInput('');
    setIsUserTyping(false);
    sendTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    if (!isUserTyping) {
      setIsUserTyping(true);
      sendTyping(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      sendTyping(false);
    }, 2000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
    
    // Trigger typing indicator
    if (!isUserTyping) {
      setIsUserTyping(true);
      sendTyping(true);
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden w-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 shadow-md flex-shrink-0 z-10 w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Back button - only on mobile */}
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Back to conversations"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Avatar */}
            <div className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${
              recipientRole === 'NURSE' 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : 'bg-gradient-to-br from-purple-400 to-purple-600'
            }`}>
              {recipientName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            {/* Name and status */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base md:text-lg text-white truncate">
                {recipientName || 'Chat'}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  recipientStatus?.isOnline 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-gray-400'
                }`}></div>
                <p className="text-xs text-blue-100">
                  {recipientStatus?.isOnline 
                    ? 'Active now' 
                    : formatLastSeen(recipientStatus?.lastSeen || null)
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilePanel(!showFilePanel)}
              className={`p-2 md:px-3 md:py-2 rounded-lg transition-all duration-200 flex items-center gap-1 md:gap-2 ${
                showFilePanel
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="font-medium hidden sm:inline">Files</span>
            </button>
            
            <button
              onClick={onStartVideoCall}
              className="px-3 py-2 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-1 md:gap-2 shadow-md hover:shadow-lg text-sm md:text-base border border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-medium hidden sm:inline">Video Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50 to-white min-h-0 w-full">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">No messages yet</p>
              <p className="text-sm text-gray-600">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId;
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
            const showTimestamp = index === messages.length - 1 || 
              messages[index + 1].senderId !== message.senderId ||
              (new Date(messages[index + 1].createdAt).getTime() - new Date(message.createdAt).getTime()) > 300000;
            
            // Check if this is a system message (video call notification)
            const isSystemMessage = message.type === 'SYSTEM';
            
            // Parse system message content
            let callIcon = null;
            let callText = '';
            let callColor = '';
            
            if (isSystemMessage) {
              if (message.content === 'VIDEO_CALL_STARTED') {
                callIcon = (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                );
                callText = isOwnMessage ? 'You started a video call' : `${message.sender.name} started a video call`;
                callColor = 'text-blue-600';
              } else if (message.content === 'VIDEO_CALL_JOINED') {
                callIcon = (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                );
                callText = isOwnMessage ? 'You joined the call' : `${message.sender.name} joined the call`;
                callColor = 'text-green-600';
              } else if (message.content.startsWith('VIDEO_CALL_ENDED:')) {
                const duration = message.content.split(':')[1];
                callIcon = (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                  </svg>
                );
                callText = `Call ended • ${duration}`;
                callColor = 'text-gray-600';
              } else if (message.content === 'VIDEO_CALL_MISSED') {
                callIcon = (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                  </svg>
                );
                callText = isOwnMessage ? 'Missed video call' : 'Missed video call';
                callColor = 'text-red-600';
              }
            }
            
            // Render system message (call notification)
            if (isSystemMessage) {
              return (
                <div key={message.id} className="flex justify-center my-2">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                    <div className={callColor}>
                      {callIcon}
                    </div>
                    <p className={`text-sm font-medium ${callColor}`}>
                      {callText}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            }
            
            // Render regular message
            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwnMessage && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-semibold">
                        {message.sender.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  {!isOwnMessage && showAvatar && (
                    <p className="text-xs font-semibold text-gray-600 mb-1 px-1">
                      {message.sender.name}
                    </p>
                  )}
                  
                  <div
                    className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-2xl shadow-sm ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  </div>
                  
                  {showTimestamp && (
                    <div className={`flex items-center gap-1 mt-1 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      <p className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {isOwnMessage && message.read && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                
                {isOwnMessage && <div className="w-8"></div>}
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Panel */}
      {showFilePanel && (
        <div className="border-t bg-gray-50 p-3 md:p-4 max-h-96 overflow-y-auto flex-shrink-0">
          <div className="space-y-4">
            <FileUploadZone
              conversationId={conversationId}
              onUploadComplete={() => setRefreshKey(prev => prev + 1)}
            />
            <FileGallery
              key={refreshKey}
              conversationId={conversationId}
              onFileClick={setSelectedFile}
            />
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t bg-white flex-shrink-0 z-10 w-full">
        <div className="flex items-end gap-2 md:gap-3 w-full max-w-full">
          <div className="flex-1 relative" ref={emojiPickerRef}>
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full px-3 md:px-4 py-2 md:py-3 pr-12 md:pr-14 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-sm md:text-base"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 md:right-3 bottom-2 md:bottom-3 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2">
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 md:gap-2 font-medium text-sm md:text-base"
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>

      {/* File Lightbox */}
      {selectedFile && (
        <FileLightbox
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
};
