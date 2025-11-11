'use client';

import React from 'react';

export const ConversationListSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white w-full">
      {/* Header Skeleton */}
      <div className="p-3 md:p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
        <div className="h-6 md:h-7 bg-blue-400/50 rounded w-32 animate-pulse"></div>
      </div>
      
      {/* Conversation Items Skeleton */}
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-3 md:p-4 border-b">
            <div className="flex items-start gap-2 md:gap-3">
              {/* Avatar Skeleton */}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
              
              {/* Content Skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
    <div className="flex flex-col h-full bg-white overflow-hidden w-full">
      {/* Header Skeleton */}
      <div className="p-3 md:p-4 border-b bg-gradient-to-r from-blue-500 to-blue-600 shadow-md flex-shrink-0 z-10 w-full">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Avatar Skeleton */}
            <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full bg-blue-400/50 animate-pulse"></div>
            
            {/* Name and status skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 bg-blue-400/50 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-blue-300/50 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Buttons Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-blue-400/50 rounded-lg animate-pulse"></div>
            <div className="h-9 w-28 bg-blue-400/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50 to-white min-h-0 w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex items-end gap-2 ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            {i % 2 !== 0 && (
              <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full animate-pulse"></div>
            )}
            
            <div className={`flex flex-col ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
              <div className={`h-12 rounded-2xl animate-pulse ${
                i % 2 === 0 
                  ? 'bg-blue-200 w-48 md:w-64 rounded-br-sm' 
                  : 'bg-gray-200 w-40 md:w-56 rounded-bl-sm'
              }`}></div>
            </div>
            
            {i % 2 === 0 && <div className="w-8"></div>}
          </div>
        ))}
      </div>
      
      {/* Input Skeleton */}
      <div className="p-3 md:p-4 border-t bg-white flex-shrink-0 z-10 w-full">
        <div className="flex items-end gap-2 md:gap-3 w-full">
          <div className="flex-1 h-10 md:h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="h-10 md:h-12 w-20 md:w-24 bg-blue-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
