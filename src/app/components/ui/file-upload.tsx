/**
 * File Upload Component
 * Drag and drop file upload with preview
 */

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFileSelect?: (files: FileList | null) => void;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      label,
      error,
      hint,
      required = false,
      disabled = false,
      accept = '*',
      multiple = false,
      maxSize,
      onFileSelect,
      id: propId,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          handleFiles(files);
        }
      },
      [disabled]
    );

    const handleFiles = (files: FileList) => {
      if (maxSize && files[0]?.size > maxSize) {
        return;
      }

      setFileName(files[0]?.name || null);

      // Create preview for images
      if (files[0]?.type.startsWith('image/')) {
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      onFileSelect?.(files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-48',
            'border-2 border-dashed rounded-xl',
            'transition-all duration-200 cursor-pointer',
            isDragOver
              ? 'border-primary-500 bg-primary-50'
              : error
              ? 'border-danger-500 bg-danger-50'
              : 'border-border-default hover:border-primary-400 hover:bg-neutral-50',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          <input
            type="file"
            ref={ref}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />

          {previewUrl ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-text-secondary">{fileName}</p>
            </motion.div>
          ) : fileName ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="h-16 w-16 flex items-center justify-center bg-primary-100 rounded-xl">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-text-secondary">{fileName}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3 text-center px-4"
            >
              <div
                className={cn(
                  'h-16 w-16 flex items-center justify-center rounded-xl transition-colors',
                  isDragOver ? 'bg-primary-200' : 'bg-neutral-100'
                )}
              >
                <svg
                  className={cn(
                    'h-8 w-8',
                    isDragOver ? 'text-primary-600' : 'text-text-muted'
                  )}
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
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {isDragOver ? 'أفلت الملف هنا' : 'اسحب وأفلت الملف هنا'}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  أو انقر لاختيار ملف
                </p>
              </div>
              {hint && (
                <p className="text-xs text-text-muted">{hint}</p>
              )}
            </motion.div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-danger-500 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
