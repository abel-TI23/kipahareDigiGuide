'use client';

/**
 * Toast Notification Component
 * Museum-themed toast notifications for CRUD operations
 */

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-700';
      case 'error':
        return 'bg-red-600 border-red-700';
      case 'warning':
        return 'bg-[var(--museum-orange)] border-[var(--museum-brown)]';
      case 'info':
        return 'bg-blue-600 border-blue-700';
      default:
        return 'bg-gray-600 border-gray-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${getToastStyles()} text-white px-6 py-4 rounded-lg shadow-2xl border-2 flex items-center gap-3 animate-slide-in-right max-w-md`}
      role="alert"
    >
      <div className="text-2xl font-bold">{getIcon()}</div>
      <div className="flex-1">
        <p className="font-semibold text-sm sm:text-base">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors ml-2"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
