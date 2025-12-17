'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (artifactId) {
      fetchArtifact();
      trackQRScan();
    }
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
      {/* Header */}
      <header className="museum-header shadow-md">
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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="museum-card overflow-hidden">
              <img
                src={artifact.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={artifact.name}
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
                {artifact.category}
              </span>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--museum-dark-brown)' }}>
                {artifact.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div>
                  <span className="font-semibold">Origin:</span> {artifact.origin}
                </div>
                <div>
                  <span className="font-semibold">Year:</span> {artifact.year}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="museum-card p-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--museum-brown)' }}>
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {artifact.description}
              </p>
            </div>

            {/* Rating Form */}
            <RatingForm artifactId={artifact.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
