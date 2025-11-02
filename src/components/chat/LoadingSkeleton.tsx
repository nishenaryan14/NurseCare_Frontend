'use client';

import React from 'react';

export const ConversationListSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="h-6 bg-blue-400 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MessageThreadSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`h-12 bg-gray-200 rounded-2xl animate-pulse ${
              i % 2 === 0 ? 'w-64' : 'w-48'
            }`}></div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
};
