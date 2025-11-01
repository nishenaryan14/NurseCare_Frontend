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
      setCurrentCall(null);
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, []);

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
  const acceptCall = useCallback(() => {
    if (!incomingCall) return;
    
    setCurrentCall({
      id: 0,
      conversationId: conversationId || 0,
      roomName: incomingCall.roomName,
      startedBy: incomingCall.callerId,
      startedAt: new Date().toISOString(),
      status: 'ONGOING',
      jitsiUrl: `https://meet.jit.si/${incomingCall.roomName}`,
    });
    
    setIncomingCall(null);
  }, [incomingCall, conversationId]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

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
