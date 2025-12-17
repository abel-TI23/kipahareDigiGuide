/**
 * Error Display Component
 * Shows error message with retry option
 */

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorDisplay({ 
  message, 
  onRetry, 
  showRetry = true 
}: ErrorDisplayProps) {
  return (
    <div className="museum-card p-8 text-center">
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--museum-brown)' }}>
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="museum-btn-primary px-6 py-3"
          >
            <svg 
              className="w-5 h-5 inline mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
