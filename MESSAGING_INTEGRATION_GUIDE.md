# Messaging Integration Guide

## How the Messaging System Works

### Flow Overview:
1. **User finds a nurse** (on `/nurses` page)
2. **User books a service** (creates a booking)
3. **User clicks "Chat with Nurse"** button
4. **System creates/finds conversation** between patient and nurse
5. **User is redirected to `/messages`** with the conversation open
6. **Users can send messages** in real-time
7. **Users can start video calls** from the chat

---

## Integration Steps

### 1. Add "Start Chat" Button to Booking Cards

In `src/app/patient/bookings/page.tsx`, add the StartChatButton:

```tsx
import { StartChatButton } from '@/components/chat/StartChatButton';

// Inside your booking card component:
<div className="booking-actions">
  {/* Existing buttons */}
  
  {/* Add Chat Button */}
  {booking.nurse && (
    <StartChatButton
      otherUserId={booking.nurse.userId}
      otherUserName={booking.nurse.user.name}
      bookingId={booking.id}
      variant="secondary"
    />
  )}
</div>
```

### 2. Add "Chat with Nurse" to Nurse Profile Cards

In `src/app/nurses/page.tsx` or nurse profile pages:

```tsx
import { StartChatButton } from '@/components/chat/StartChatButton';

// Inside nurse card:
<StartChatButton
  otherUserId={nurse.userId}
  otherUserName={nurse.user.name}
  variant="primary"
/>
```

### 3. Add to Nurse's Appointment View

In `src/app/nurse/appointments/page.tsx`:

```tsx
import { StartChatButton } from '@/components/chat/StartChatButton';

// Inside appointment card:
<StartChatButton
  otherUserId={appointment.patient.id}
  otherUserName={appointment.patient.name}
  bookingId={appointment.id}
  variant="secondary"
/>
```

---

## Complete Example: Booking Card with Chat

```tsx
'use client';

import { StartChatButton } from '@/components/chat/StartChatButton';

function BookingCard({ booking }) {
  return (
    <div className="booking-card p-4 border rounded-lg">
      <h3>{booking.nurse.user.name}</h3>
      <p>Date: {formatDate(booking.scheduledAt)}</p>
      <p>Status: {booking.status}</p>
      
      <div className="flex gap-2 mt-4">
        {/* View Details Button */}
        <button className="btn-primary">
          View Details
        </button>
        
        {/* Chat Button */}
        <StartChatButton
          otherUserId={booking.nurse.userId}
          otherUserName={booking.nurse.user.name}
          bookingId={booking.id}
          variant="secondary"
        />
      </div>
    </div>
  );
}
```

---

## API Flow

### 1. Create Conversation
```
POST /messaging/conversations
Body: {
  otherUserId: 2,
  bookingId: 5 (optional)
}

Response: {
  id: 1,
  participants: [...],
  messages: []
}
```

### 2. Send Message (via Socket.io)
```javascript
socket.emit('sendMessage', {
  conversationId: 1,
  senderId: 1,
  content: 'Hello!',
  type: 'TEXT'
});
```

### 3. Receive Message (via Socket.io)
```javascript
socket.on('newMessage', (message) => {
  // Update UI with new message
});
```

---

## Testing the Flow

### Manual Test:
1. **Login as Patient**
2. **Go to `/nurses`** page
3. **Book a nurse** (or use existing booking)
4. **Go to `/patient/bookings`**
5. **Click "Chat with Nurse"** button
6. **You'll be redirected to `/messages`** with conversation open
7. **Send a message**
8. **Login as Nurse** (in another browser/incognito)
9. **Go to `/messages`**
10. **See the conversation and reply**

### Programmatic Test:
```bash
# Start backend
cd nursing-backend
npm run start:dev

# Start frontend
cd nursing-frontend
npm run dev

# Open http://localhost:3000
```

---

## Quick Start: Add Chat to Existing Pages

### Option 1: Simple Link (No Button Component)
```tsx
import Link from 'next/link';

<Link 
  href={`/messages?userId=${nurseId}`}
  className="text-blue-500 hover:underline"
>
  💬 Chat with Nurse
</Link>
```

### Option 2: With StartChatButton Component
```tsx
import { StartChatButton } from '@/components/chat/StartChatButton';

<StartChatButton
  otherUserId={nurseId}
  otherUserName={nurseName}
  bookingId={bookingId} // optional
/>
```

---

## Common Issues & Solutions

### Issue: "No conversations found"
**Solution:** User needs to click "Start Chat" button first to create a conversation.

### Issue: "Messages not updating in real-time"
**Solution:** Check if Socket.io is connected. Look for "Socket connected" in browser console.

### Issue: "Can't send messages"
**Solution:** Ensure user is authenticated and has a valid JWT token.

### Issue: "Video call not working"
**Solution:** Check if Jitsi Meet script is loaded. Open browser console for errors.

---

## Next Steps

1. **Add StartChatButton to all relevant pages**
2. **Test the complete flow**
3. **Add notifications for new messages**
4. **Add file/image sharing** (future enhancement)
