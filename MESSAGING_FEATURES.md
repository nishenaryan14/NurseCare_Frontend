# Real-Time Messaging & Video Calling Features

## Overview
This document describes the real-time communication features implemented in the NurseCare application.

## Features

### 1. Real-Time Messaging (Socket.io)
- **Instant messaging** between patients and nurses
- **Typing indicators** to show when someone is typing
- **Read receipts** to track message status
- **Unread message count** badge
- **Message history** with pagination
- **Conversation list** with last message preview

### 2. Video Calling (Jitsi Meet)
- **One-click video calls** directly from chat
- **Incoming call notifications** with accept/reject options
- **Call history** tracking
- **Call duration** tracking
- **Free unlimited video calls** via Jitsi Meet

## Components

### Context & Hooks
- `SocketContext.tsx` - WebSocket connection management
- `useMessaging.ts` - Messaging functionality hook
- `useVideoCall.ts` - Video calling functionality hook

### Chat Components
- `ConversationList.tsx` - List of all conversations
- `MessageThread.tsx` - Message display and input
- `VideoCallModal.tsx` - Jitsi Meet video call interface
- `IncomingCallNotification.tsx` - Incoming call alert

### Pages
- `/messages` - Main messaging interface

## Usage

### Starting a Conversation
```typescript
const { createConversation } = useMessaging();
await createConversation(nurseId, bookingId);
```

### Sending a Message
```typescript
const { sendMessage } = useMessaging(conversationId);
sendMessage('Hello!');
```

### Starting a Video Call
```typescript
const { startCall } = useVideoCall(conversationId);
await startCall();
```

## API Endpoints

### Messaging
- `POST /messaging/conversations` - Create/get conversation
- `GET /messaging/conversations` - Get all conversations
- `GET /messaging/conversations/:id/messages` - Get messages
- `POST /messaging/conversations/:id/read` - Mark as read
- `GET /messaging/unread-count` - Get unread count

### Video Calls
- `POST /video-calls/start` - Start video call
- `PATCH /video-calls/:id/end` - End video call
- `GET /video-calls/room/:roomName` - Get call by room
- `GET /video-calls/conversation/:id/history` - Call history
- `GET /video-calls/conversation/:id/ongoing` - Get ongoing call

## WebSocket Events

### Emitted by Client
- `register` - Register user with socket
- `sendMessage` - Send a message
- `joinConversation` - Join conversation room
- `leaveConversation` - Leave conversation room
- `typing` - Send typing indicator
- `startVideoCall` - Initiate video call

### Received by Client
- `registered` - Registration confirmation
- `newMessage` - New message received
- `userTyping` - User is typing
- `incomingVideoCall` - Incoming call notification

## Environment Variables
```
NEXT_PUBLIC_API_URL=https://nursecare-backend-luth.onrender.com
```

## Dependencies
- `socket.io-client` - WebSocket client
- `@jitsi/react-sdk` - Jitsi Meet integration

## Notes
- All messages are stored in the database
- Video calls use Jitsi Meet's free public infrastructure
- WebSocket connection automatically reconnects on disconnect
- Typing indicators timeout after 2 seconds of inactivity
