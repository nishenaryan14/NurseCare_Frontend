'use client';

import React, { useState, useEffect } from 'react';
import { StartChatButton } from '@/components/chat/StartChatButton';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function TestChatPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all users (you might want to filter by role)
      const response = await api.get('/users');
      // Filter out current user
      const otherUsers = response.data.filter((u: any) => u.id !== user?.id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // If users endpoint doesn't exist, create dummy data
      setUsers([
        { id: 1, name: 'Nurse Sarah', email: 'nurse1@local.test', role: 'NURSE' },
        { id: 2, name: 'Patient John', email: 'patient1@local.test', role: 'PATIENT' },
        { id: 3, name: 'Admin User', email: 'admin@local.test', role: 'ADMIN' },
      ].filter(u => u.id !== user?.id));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">Please Login</h2>
          <p className="text-yellow-700">You need to be logged in to test the chat feature.</p>
          <a href="/auth/login" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Chat Feature</h1>
          <p className="text-gray-600">
            Click on any user below to start a conversation. You'll be redirected to the messages page.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Logged in as:</strong> {user.name || user.email} ({user.role})
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">How to Test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Chat with [User]" button below</li>
            <li>You'll be redirected to the Messages page</li>
            <li>The conversation will be automatically opened</li>
            <li>Type a message and send it</li>
            <li>Open another browser (or incognito) and login as another user</li>
            <li>Go to Messages to see the conversation and reply</li>
          </ol>
        </div>

        {/* User List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Available Users to Chat With:</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No other users available</p>
              <p className="text-sm text-gray-400 mt-2">
                Create more users to test the chat feature
              </p>
            </div>
          ) : (
            users.map((otherUser) => (
              <div
                key={otherUser.id}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {otherUser.name?.charAt(0) || otherUser.email?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{otherUser.name || 'Unknown'}</h3>
                      <p className="text-sm text-gray-500">{otherUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {otherUser.role}
                      </span>
                    </div>
                  </div>
                  <StartChatButton
                    otherUserId={otherUser.id}
                    otherUserName={otherUser.name || otherUser.email}
                    variant="primary"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">Quick Links:</h3>
          <div className="flex gap-4">
            <a
              href="/messages"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Go to Messages
            </a>
            <a
              href="/patient/bookings"
              className="px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              My Bookings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
