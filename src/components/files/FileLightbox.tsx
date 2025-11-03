'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface FileItem {
  id: number;
  filename: string;
  mimetype: string;
  size: number;
  uploadedBy: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface FileLightboxProps {
  file: FileItem | null;
  allFiles?: FileItem[];
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const FileLightbox: React.FC<FileLightboxProps> = ({
  file,
  allFiles = [],
  onClose,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onNavigate) onNavigate('prev');
      if (e.key === 'ArrowRight' && onNavigate) onNavigate('next');
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, onNavigate]);

  if (!file) return null;

  const isImage = file.mimetype.startsWith('image/');
  const isPDF = file.mimetype === 'application/pdf';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await api.get(`/files/${file.id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    } finally {
      setIsDownloading(false);
    }
  };

  const currentIndex = allFiles.findIndex((f) => f.id === file.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allFiles.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation Buttons */}
      {onNavigate && hasPrev && (
        <button
          onClick={() => onNavigate('prev')}
          className="absolute left-4 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {onNavigate && hasNext && (
        <button
          onClick={() => onNavigate('next')}
          className="absolute right-4 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        {/* File Display */}
        <div className="flex-1 flex items-center justify-center w-full max-w-6xl">
          {isImage ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/files/${file.id}/download`}
              alt={file.filename}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
            />
          ) : isPDF ? (
            <iframe
              src={`${process.env.NEXT_PUBLIC_API_URL}/files/${file.id}/download`}
              className="w-full h-full bg-white rounded-lg"
              title={file.filename}
            />
          ) : (
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold mb-2">{file.filename}</p>
              <p className="text-sm text-gray-300 mb-4">
                Preview not available for this file type
              </p>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDownloading ? 'Downloading...' : 'Download File'}
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-3">
          {/* Zoom Controls (for images only) */}
          {isImage && (
            <>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                disabled={zoom <= 0.5}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                  />
                </svg>
              </button>

              <span className="text-white text-sm font-medium min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                disabled={zoom >= 3}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </button>

              <div className="w-px h-6 bg-white bg-opacity-30"></div>
            </>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all disabled:opacity-50"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>

          {/* File Info */}
          <div className="hidden md:block text-white text-sm ml-2">
            <p className="font-medium">{file.filename}</p>
            <p className="text-xs text-gray-300">
              {file.uploadedBy.name} • {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
