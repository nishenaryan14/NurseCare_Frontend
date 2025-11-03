'use client';

import React, { useState, useRef, useCallback } from 'react';
import { api } from '@/lib/api';

interface FileUploadZoneProps {
  conversationId?: number;
  onUploadComplete?: (file: any) => void;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  conversationId,
  onUploadComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [conversationId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    // Validate files
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    // Add files to uploading state
    const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
      file,
      progress: 0,
      status: 'uploading',
    }));

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      await uploadFile(file, uploadingFiles.length + i);
    }
  };

  const uploadFile = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) {
      formData.append('conversationId', conversationId.toString());
    }

    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;

          setUploadingFiles((prev) =>
            prev.map((f, i) =>
              i === index ? { ...f, progress } : f
            )
          );
        },
      });

      // Mark as success
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'success', progress: 100 } : f
        )
      );

      // Callback
      if (onUploadComplete) {
        onUploadComplete(response.data.file);
      }

      // Remove from list after 2 seconds
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
      }, 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: 'error',
                error: error.response?.data?.message || 'Upload failed',
              }
            : f
        )
      );
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return '🖼️';
    } else if (ext === 'pdf') {
      return '📄';
    } else if (['doc', 'docx'].includes(ext || '')) {
      return '📝';
    } else if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return '📊';
    } else if (['zip', 'rar'].includes(ext || '')) {
      return '📦';
    } else if (['mp3', 'wav'].includes(ext || '')) {
      return '🎵';
    } else if (['mp4', 'avi', 'mov'].includes(ext || '')) {
      return '🎥';
    }
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 md:p-8 transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar,.mp3,.wav,.mp4,.avi,.mov"
        />

        <div className="text-center">
          <div className="mb-4">
            <svg
              className={`w-12 h-12 md:w-16 md:h-16 mx-auto transition-all duration-300 ${
                isDragging ? 'text-blue-500 scale-110' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <p className="text-base md:text-lg font-semibold text-gray-700 mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to browse</p>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-100 rounded">Images</span>
            <span className="px-2 py-1 bg-gray-100 rounded">PDFs</span>
            <span className="px-2 py-1 bg-gray-100 rounded">Documents</span>
            <span className="px-2 py-1 bg-gray-100 rounded">Max 10MB</span>
          </div>
        </div>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getFileIcon(uploadingFile.file.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadingFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {uploadingFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadingFile.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {uploadingFile.progress}%
                      </p>
                    </div>
                  )}

                  {/* Success */}
                  {uploadingFile.status === 'success' && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-green-600 font-medium">
                        Uploaded successfully
                      </span>
                    </div>
                  )}

                  {/* Error */}
                  {uploadingFile.status === 'error' && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-red-600 font-medium">
                        {uploadingFile.error || 'Upload failed'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
