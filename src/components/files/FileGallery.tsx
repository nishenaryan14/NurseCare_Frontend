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

interface FileGalleryProps {
  conversationId: number;
  onFileClick?: (file: FileItem) => void;
}

export const FileGallery: React.FC<FileGalleryProps> = ({
  conversationId,
  onFileClick,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchFiles();
  }, [conversationId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/files/conversation/${conversationId}`);
      setFiles(response.data.files || []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
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
    }
  };

  const getFileIcon = (mimetype: string, filename: string) => {
    if (mimetype.startsWith('image/')) {
      return { icon: '🖼️', color: 'from-purple-400 to-purple-600' };
    } else if (mimetype === 'application/pdf') {
      return { icon: '📄', color: 'from-red-400 to-red-600' };
    } else if (
      mimetype.includes('word') ||
      mimetype.includes('document')
    ) {
      return { icon: '📝', color: 'from-blue-400 to-blue-600' };
    } else if (
      mimetype.includes('sheet') ||
      mimetype.includes('excel')
    ) {
      return { icon: '📊', color: 'from-green-400 to-green-600' };
    } else if (mimetype.includes('zip') || mimetype.includes('rar')) {
      return { icon: '📦', color: 'from-yellow-400 to-yellow-600' };
    } else if (mimetype.startsWith('audio/')) {
      return { icon: '🎵', color: 'from-pink-400 to-pink-600' };
    } else if (mimetype.startsWith('video/')) {
      return { icon: '🎥', color: 'from-indigo-400 to-indigo-600' };
    }
    return { icon: '📎', color: 'from-gray-400 to-gray-600' };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const isImage = (mimetype: string) => mimetype.startsWith('image/');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
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
        <p className="text-gray-500 text-sm">No files shared yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Shared Files ({files.length})
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {files.map((file) => {
            const { icon, color } = getFileIcon(file.mimetype, file.filename);
            return (
              <div
                key={file.id}
                className="group bg-white border border-gray-200 rounded-xl p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => onFileClick && onFileClick(file)}
              >
                {/* Icon/Thumbnail */}
                <div
                  className={`w-full aspect-square rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}
                >
                  {isImage(file.mimetype) ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/files/${file.id}/download`}
                      alt={file.filename}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-4xl">{icon}</span>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(file.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                  >
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {files.map((file) => {
            const { icon, color } = getFileIcon(file.mimetype, file.filename);
            return (
              <div
                key={file.id}
                className="group bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => onFileClick && onFileClick(file)}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <span className="text-2xl">{icon}</span>
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.uploadedBy.name}</span>
                      <span>•</span>
                      <span>{formatDate(file.createdAt)}</span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    className="flex-shrink-0 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
