'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RatingForm from '@/components/artifacts/RatingForm';

interface Artifact {
  id: number;
  name: string;
  category: string;
  origin: string;
  year: string;
  description: string;
  image_url: string;
}

export default function ArtifactDetailPage() {
  const params = useParams();
  const artifactId = params.id as string;
  
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (artifactId) {
      fetchArtifact();
      trackQRScan();
    }
    
    // Cleanup speech synthesis on unmount
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [artifactId]);

  const fetchArtifact = async () => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}`);
      const data = await response.json();

      if (data.success) {
        setArtifact(data.data);
      } else {
        setError(data.error || 'Artifact not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load artifact');
    } finally {
      setLoading(false);
    }
  };

  const trackQRScan = async () => {
    try {
      await fetch('/api/qr-scan/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artifactId: parseInt(artifactId) }),
      });
    } catch (err) {
      console.error('Failed to track QR scan:', err);
    }
  };

  const toggleSpeech = () => {
    if (!artifact) return;

    if (isPlaying) {
      // Stop speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start speech
      const utterance = new SpeechSynthesisUtterance(artifact.description);
      utterance.lang = 'id-ID'; // Indonesian language
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--museum-light-cream)' }}>
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[var(--museum-orange)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading artifact...</p>
        </div>
      </div>
    );
  }

  if (error || !artifact) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--museum-light-cream)' }}>
        <div className="museum-card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--museum-brown)' }}>
            Artifact Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The artifact you are looking for does not exist.'}
          </p>
          <Link href="/" className="museum-btn-primary inline-block px-6 py-3">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--museum-light-cream)' }}>
      {/* Header - Hidden on mobile for immersive view */}
      <header className="museum-header shadow-md hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-[var(--museum-orange)] text-white px-4 py-2 rounded-lg font-bold text-xl">
                KP
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                  Ki Pahare DigiGuide
                </div>
                <p className="text-xs text-gray-600">Museum Digital</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-semibold text-gray-800"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-6xl">
        {/* Mobile View */}
        <div className="md:hidden min-h-screen bg-black relative">
          {/* Top Bar - Mobile */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
            {/* Back Button */}
            <Link 
              href="/"
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95"
              aria-label="Back to home"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <div className="flex items-center gap-2">
              <div 
                className="font-bold text-sm tracking-wider"
                style={{
                  color: 'white',
                  textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000'
                }}
              >
                Kipahare<br/>DigiGuide
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">ID</span>
              </div>
            </div>
          </div>

          {/* Artifact Image - Full Screen on Mobile */}
          <div className="relative w-full h-[60vh]">
            <img
              src={artifact?.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={artifact?.name || ''}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
          </div>

          {/* Content Overlay - Mobile */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent text-white p-6 pb-8">
            {/* Title and Audio Control */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-3 tracking-wide" style={{ fontFamily: 'serif' }}>
                {artifact?.name}
              </h1>
              
              {/* Audio Player UI */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={toggleSpeech}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                
                {/* Waveform Animation */}
                <div className="flex-1 flex items-center gap-1 h-8">
                  {isPlaying ? (
                    <>
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-white rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 60 + 20}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '1s'
                          }}
                        ></div>
                      ))}
                    </>
                  ) : (
                    <>
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-white bg-opacity-50 rounded-full"
                          style={{ height: '20%' }}
                        ></div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Expandable Description */}
            <div className="mb-4">
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="flex items-center gap-2 text-sm font-semibold mb-2 hover:text-[var(--museum-orange)] transition-colors"
              >
                <span>Keterangan</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDescriptionExpanded && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                    {artifact?.name}
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    {artifact?.description}
                  </p>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <div>
                      <span className="font-semibold">Asal:</span> {artifact?.origin}
                    </div>
                    <div>
                      <span className="font-semibold">Tahun:</span> {artifact?.year}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Expandable Rating Section */}
            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={() => setIsRatingExpanded(!isRatingExpanded)}
                className="flex items-center justify-between w-full text-sm font-semibold hover:text-[var(--museum-orange)] transition-colors"
              >
                <span>Berikan Rating (Opsional)</span>
                <svg
                  className={`w-5 h-5 transition-transform ${isRatingExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isRatingExpanded && artifact && (
                <div className="mt-4 animate-fadeIn">
                  <RatingForm artifactId={artifact.id} darkMode={true} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="museum-card overflow-hidden">
              <img
                src={artifact?.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={artifact?.name || ''}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                }}
              />
            </div>

            {/* Category Badge */}
            <div className="mt-4">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{
                background: 'var(--museum-orange)',
                color: 'white'
              }}>
                {artifact?.category}
              </span>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--museum-dark-brown)' }}>
                {artifact?.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div>
                  <span className="font-semibold">Origin:</span> {artifact?.origin}
                </div>
                <div>
                  <span className="font-semibold">Year:</span> {artifact?.year}
                </div>
              </div>
            </div>

            {/* Description with Audio */}
            <div className="museum-card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                  Description
                </h2>
                <button
                  onClick={toggleSpeech}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    background: isPlaying ? 'var(--museum-orange)' : 'var(--museum-light-orange)',
                    color: isPlaying ? 'white' : 'var(--museum-brown)'
                  }}
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>Listen</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {artifact?.description}
              </p>
            </div>

            {/* Rating Form */}
            {artifact && <RatingForm artifactId={artifact.id} />}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
