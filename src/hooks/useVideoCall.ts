'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import api from '@/lib/api';

interface VideoCall {
  id: number;
  conversationId: number;
  roomName: string;
  startedBy: number;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  status: string;
  jitsiUrl?: string;
}

export const useVideoCall = (conversationId?: number) => {
  const { socket } = useSocket();
  const [currentCall, setCurrentCall] = useState<VideoCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ roomName: string; callerId: number } | null>(null);
  const [callHistory, setCallHistory] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(false);

  // Start a video call
  const startCall = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const response = await api.post('/video-calls/start', { conversationId });
      const call = response.data;
      setCurrentCall(call);

      // Notify other participants via Socket.io
      if (socket) {
        socket.emit('startVideoCall', {
          conversationId,
          roomName: call.roomName,
          userId: parseInt(localStorage.getItem('userId') || '0'),
          callId: call.id,
        });
      }

      return call;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [conversationId, socket]);

  // End a video call
  const endCall = useCallback(async (callId: number) => {
    try {
      await api.patch(`/video-calls/${callId}/end`);
      
      // Notify other participants via Socket.io
      if (socket && conversationId) {
        socket.emit('endVideoCall', {
          conversationId,
          userId: parseInt(localStorage.getItem('userId') || '0'),
        });
      }
      
      setCurrentCall(null);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [socket, conversationId]);

  // Get ongoing call
  const getOngoingCall = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await api.get(`/video-calls/conversation/${conversationId}/ongoing`);
      if (response.data) {
        setCurrentCall(response.data);
      }
    } catch (error) {
      console.error('Error fetching ongoing call:', error);
    }
  }, [conversationId]);

  // Get call history
  const getCallHistory = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await api.get(`/video-calls/conversation/${conversationId}/history`);
      setCallHistory(response.data);
    } catch (error) {
      console.error('Error fetching call history:', error);
    }
  }, [conversationId]);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: { roomName: string; callerId: number }) => {
      setIncomingCall(data);
    };

    socket.on('incomingVideoCall', handleIncomingCall);

    return () => {
      socket.off('incomingVideoCall', handleIncomingCall);
    };
  }, [socket]);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    
    try {
      // Call backend to accept and create system message
      const response = await api.post('/video-calls/accept', {
        roomName: incomingCall.roomName,
      });
      
      setCurrentCall({
        ...response.data,
        jitsiUrl: `https://meet.jit.si/${incomingCall.roomName}`,
      });
      
      // Notify other participants via Socket.io
      if (socket && conversationId) {
        socket.emit('acceptVideoCall', {
          conversationId,
          roomName: incomingCall.roomName,
          userId: parseInt(localStorage.getItem('userId') || '0'),
        });
      }
      
      setIncomingCall(null);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  }, [incomingCall, conversationId, socket]);

  // Reject incoming call
  const rejectCall = useCallback(async () => {
    if (!incomingCall) return;
    
    try {
      // Mark call as missed in backend
      if (incomingCall.callerId) {
        await api.patch(`/video-calls/${incomingCall.callerId}/missed`);
      }
      
      // Notify other participants via Socket.io
      if (socket && conversationId) {
        socket.emit('rejectVideoCall', {
          conversationId,
          callId: incomingCall.callerId,
          userId: parseInt(localStorage.getItem('userId') || '0'),
        });
      }
      
      setIncomingCall(null);
    } catch (error) {
      console.error('Error rejecting call:', error);
      setIncomingCall(null);
    }
  }, [incomingCall, socket, conversationId]);

  // Fetch ongoing call on mount
  useEffect(() => {
    if (conversationId) {
      getOngoingCall();
      getCallHistory();
    }
  }, [conversationId, getOngoingCall, getCallHistory]);

  return {
    currentCall,
    incomingCall,
    callHistory,
    loading,
    startCall,
    endCall,
    acceptCall,
    rejectCall,
    getCallHistory,
  };
};
