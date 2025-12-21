'use client';

import { useState } from 'react';

interface RatingFormProps {
  artifactId: number;
  onSuccess?: () => void;
  darkMode?: boolean;
}

export default function RatingForm({ artifactId, onSuccess, darkMode = false }: RatingFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [visitorName, setVisitorName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifact_id: artifactId,
          visitor_name: visitorName || null,
          email: email || null,
          rating,
          comment: comment || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
        
        // Reset form
        setTimeout(() => {
          setRating(0);
          setVisitorName('');
          setEmail('');
          setComment('');
          setSubmitted(false);
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`museum-card p-6 text-center ${darkMode ? 'bg-gray-800 bg-opacity-90 backdrop-blur-sm' : ''}`}>
        <div className="text-4xl mb-3">✓</div>
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : ''}`} style={!darkMode ? { color: 'var(--museum-brown)' } : {}}>
          Thank You!
        </h3>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Your feedback has been submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className={`museum-card p-6 ${darkMode ? 'bg-gray-800 bg-opacity-90 backdrop-blur-sm' : ''}`}>
      <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`} style={!darkMode ? { color: 'var(--museum-brown)' } : {}}>
        Rate This Artifact
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`} style={!darkMode ? { color: 'var(--museum-brown)' } : {}}>
            Your Rating *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-4xl transition-colors focus:outline-none"
                style={{
                  color: (hoveredRating || rating) >= star 
                    ? 'var(--museum-orange)' 
                    : darkMode ? '#4B5563' : '#d1d5db'
                }}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Name (Optional) */}
        <div>
          <label htmlFor="visitorName" className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`} style={!darkMode ? { color: 'var(--museum-brown)' } : {}}>
            Your Name (optional)
          </label>
          <input
            type="text"
            id="visitorName"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[var(--museum-orange)]' 
                : 'border-gray-300 focus:ring-[var(--museum-orange)]'
            }`}
            placeholder="John Doe"
          />
        </div>

        {/* Email (Optional) */}
        <div>
          <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`} style={!darkMode ? { color: 'var(--museum-brown)' } : {}}>
            Email (optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[var(--museum-orange)]' 
                : 'border-gray-300 focus:ring-[var(--museum-orange)]'
            }`}
            placeholder="john@example.com"
          />
        </div>

        {/* Comment (Optional) */}
        <div>
          <label htmlFor="comment" className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`} style={!darkMode ? { color: 'var(--museum-brown)' } : {}}>
            Your Comment (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[var(--museum-orange)]' 
                : 'border-gray-300 focus:ring-[var(--museum-orange)]'
            }`}
            placeholder="Share your thoughts about this artifact..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-3 border rounded ${
            darkMode 
              ? 'bg-red-900 bg-opacity-50 border-red-700 text-red-200' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full museum-btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Submitting...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
}
