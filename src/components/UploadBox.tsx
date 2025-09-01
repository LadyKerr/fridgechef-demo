/**
 * UploadBox Component
 * Handles image upload via drag & drop or file selection
 */

import React, { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface UploadBoxProps {
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

export function UploadBox({ onImageUpload, isLoading = false }: UploadBoxProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Validate and process selected file
  const handleFileSelection = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    onImageUpload(file);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`
        relative w-full p-8 border-2 border-dashed rounded-2xl
        transition-all duration-300 cursor-pointer
        ${isDragOver 
          ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100' 
          : 'border-orange-300 hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100'
        }
        ${isLoading ? 'pointer-events-none opacity-60' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload fridge photo"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isLoading}
      />

      {/* Upload content */}
      <div className="text-center space-y-4">
        {isLoading ? (
          <>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <div>
              <p className="text-orange-700 font-medium">Analyzing your fridge...</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <p className="text-orange-700 font-medium mb-2">
                Upload your fridge photo
              </p>
              <p className="text-gray-500 text-sm">
                Drag & drop or click to browse • JPG, PNG up to 10MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
