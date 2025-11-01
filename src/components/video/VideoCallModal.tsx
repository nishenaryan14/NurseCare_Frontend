'use client';

import React, { useEffect } from 'react';

interface VideoCallModalProps {
  roomName: string;
  onEndCall: () => void;
  isOpen: boolean;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  roomName,
  onEndCall,
  isOpen,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Load Jitsi Meet API script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: roomName,
        parentNode: document.getElementById('jitsi-container'),
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'desktop',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'profile',
            'chat',
            'recording',
            'livestreaming',
            'etherpad',
            'sharedvideo',
            'settings',
            'raisehand',
            'videoquality',
            'filmstrip',
            'feedback',
            'stats',
            'shortcuts',
            'tileview',
            'download',
            'help',
            'mute-everyone',
          ],
        },
      });

      // Listen for hangup event
      api.addEventListener('readyToClose', () => {
        onEndCall();
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen, roomName, onEndCall]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Video Call</h2>
          <button
            onClick={onEndCall}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            End Call
          </button>
        </div>

        {/* Jitsi Container */}
        <div id="jitsi-container" className="flex-1"></div>
      </div>
    </div>
  );
};
