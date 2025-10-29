'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Artifact } from '@/types';

interface ArtifactCardProps {
  artifact: Artifact;
}

export default function ArtifactCard({ artifact }: ArtifactCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artifact.name,
        text: artifact.description,
        url: `/artifacts/${artifact.id}`,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/artifacts/${artifact.id}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="museum-card group">
      {/* Image Container */}
      <div className="relative overflow-hidden h-56 sm:h-64 md:h-72 bg-gray-100">
        {artifact.image_url && !imageError ? (
          <img
            src={artifact.image_url}
            alt={artifact.name}
            className="artifact-image w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-5xl sm:text-6xl">🏛️</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 touch-manipulation"
            aria-label="Favorite"
          >
            <span className={`text-lg sm:text-xl ${isFavorited ? 'text-red-500' : 'text-gray-400'}`}>
              {isFavorited ? '❤️' : '♡'}
            </span>
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 touch-manipulation"
            aria-label="Share"
          >
            <span className="text-base sm:text-lg">⤴</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5">
        {/* Header with badges */}
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="museum-badge text-xs sm:text-sm">
            {artifact.category}
          </span>
          <span className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--museum-orange)' }}>
            {artifact.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2" style={{ color: 'var(--museum-brown)' }}>
          {artifact.name}
        </h3>

        {/* Origin */}
        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          📍 {artifact.origin}
        </p>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
          {artifact.description}
        </p>

        {/* View Details Button */}
        <Link href={`/artifacts/${artifact.id}`}>
          <button className="w-full museum-btn-primary py-3 text-sm sm:text-base touch-manipulation">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
