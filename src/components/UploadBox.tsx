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
        relative w-full max-w-sm mx-auto p-8 border-2 border-dashed rounded-xl
        transition-all duration-200 cursor-pointer
        ${isDragOver 
          ? 'border-warm-400 bg-warm-100' 
          : 'border-warm-300 hover:border-warm-400 hover:bg-warm-50'
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
            <Loader2 className="w-8 h-8 mx-auto text-warm-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-warm-700">Analyzing your fridge...</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <Upload className="w-8 h-8 text-warm-600" />
            </div>
            
            <div>
              <p className="text-sm font-medium text-warm-700 mb-1">
                Upload fridge photo
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
