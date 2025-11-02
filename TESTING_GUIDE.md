# Messaging System Testing Guide

## Issue Fixed: userId Not in localStorage

**Problem:** Socket.io couldn't register users because `userId` wasn't stored in localStorage.

**Solution:** Updated AuthContext to store `userId` in localStorage on login.

---

## How to Test Messaging System

### Step 1: Clear Browser Storage (Important!)
```javascript
// Open browser console (F12) and run:
localStorage.clear()
```

### Step 2: Login Again
1. Go to `/auth/login`
2. Login with your credentials
3. Check console - you should see:
   - ✅ Socket connected: [socket-id]
   - 📝 Registering user: [user-id]

### Step 3: Verify userId is Stored
```javascript
// In browser console:
localStorage.getItem('userId')
// Should return a number like "1" or "2"
```

### Step 4: Create a Test Conversation

**Option A: Use Test Page**
1. Go to `http://localhost:3000/test-chat`
2. Click "Chat with [User]" button
3. You'll be redirected to messages with conversation open

**Option B: Use Bookings**
1. Go to `/patient/bookings`
2. Click on a booking
3. Click "Chat with Nurse" button

### Step 5: Send a Test Message
1. Type a message in the input box
2. Click "Send"
3. Check browser console for:
   - Message sent event
   - New message received event

---

## Debugging Checklist

### ✅ Check Authentication
```javascript
// Browser console:
localStorage.getItem('accessToken')  // Should return JWT token
localStorage.getItem('userId')       // Should return user ID
```

### ✅ Check Socket Connection
Look for in console:
- ✅ Socket connected: [id]
- 📝 Registering user: [userId]

### ✅ Check API Endpoints
```bash
# Test conversations endpoint (replace TOKEN with your accessToken)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/messaging/conversations

# Test create conversation
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"otherUserId": 2}' \
  http://localhost:3001/messaging/conversations
```

### ✅ Check Backend Logs
Look for in backend console:
- Client connected: [socket-id]
- User [userId] registered with socket [socket-id]
- Message sent logs

---

## Common Issues & Solutions

### Issue: "No userId found in localStorage"
**Solution:** 
1. Logout
2. Clear localStorage: `localStorage.clear()`
3. Login again

### Issue: "Fetched messages: 0"
**Solution:** 
- This is normal if no messages have been sent yet
- Send a test message to create the first message

### Issue: "Socket not connecting"
**Solution:**
1. Check backend is running: `curl http://localhost:3001`
2. Check CORS settings in backend
3. Check NEXT_PUBLIC_API_URL in frontend .env

### Issue: "Messages not appearing in real-time"
**Solution:**
1. Check both users are connected (check console logs)
2. Verify Socket.io events are being emitted
3. Check browser console for errors

---

## Testing with Two Users

### Setup:
1. **Browser 1 (Normal):** Login as Patient
2. **Browser 2 (Incognito):** Login as Nurse

### Test Flow:
1. **Patient (Browser 1):**
   - Go to `/test-chat`
   - Click "Chat with Nurse"
   - Send message: "Hello from patient"

2. **Nurse (Browser 2):**
   - Go to `/messages`
   - Should see conversation appear
   - Should see "Hello from patient" message
   - Reply: "Hello from nurse"

3. **Patient (Browser 1):**
   - Should see "Hello from nurse" appear in real-time
   - Red badge should appear on "Messages" link

---

## Database Check

### Check if conversation exists:
```sql
-- In your database client:
SELECT * FROM "Conversation";
SELECT * FROM "ConversationParticipant";
SELECT * FROM "Message";
```

### Create test data manually (if needed):
```sql
-- Create conversation between user 1 and user 2
INSERT INTO "Conversation" (id, "createdAt", "updatedAt")
VALUES (1, NOW(), NOW());

-- Add participants
INSERT INTO "ConversationParticipant" ("conversationId", "userId", "joinedAt")
VALUES (1, 1, NOW()), (1, 2, NOW());

-- Add test message
INSERT INTO "Message" ("conversationId", "senderId", content, type, read, "createdAt")
VALUES (1, 1, 'Test message', 'TEXT', false, NOW());
```

---

## Success Indicators

### ✅ Everything Working:
- Socket connects on page load
- userId is registered
- Conversations list loads
- Messages appear when sent
- Real-time updates work
- Typing indicators show
- Unread badge updates

### 🎉 You're Ready!
Once all checks pass, your messaging system is fully functional!
