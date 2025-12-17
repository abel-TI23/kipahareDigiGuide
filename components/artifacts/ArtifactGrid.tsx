'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArtifactCard from '@/components/artifacts/ArtifactCard';
import SearchBar from '@/components/artifacts/SearchBar';
import Skeleton from '@/components/ui/Skeleton';
import type { Artifact } from '@/types';

export default function ArtifactGrid() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/artifacts');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch artifacts`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check your database connection.');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const artifactsList = data.data?.artifacts || [];
        setArtifacts(artifactsList);
        setFilteredArtifacts(artifactsList);
      } else {
        throw new Error(data.error || 'Failed to load artifacts');
      }
    } catch (err) {
      console.error('Error fetching artifacts:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading artifacts');
      setArtifacts([]);
      setFilteredArtifacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterArtifacts();
  }, [searchQuery, selectedCategory, artifacts]);

  const filterArtifacts = () => {
    let filtered = [...artifacts];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(artifact =>
        artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(artifact => 
        artifact.category === selectedCategory
      );
    }

    setFilteredArtifacts(filtered);
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <Skeleton count={6} type="card" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="museum-card p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchArtifacts}
              className="museum-btn-primary px-6 py-3"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (artifacts.length === 0) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="museum-card p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-5xl">🏛️</span>
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--museum-brown)' }}>
              Collection Coming Soon
            </h3>
            <p className="text-gray-600 mb-6">
              Our museum collection is being prepared. Check back soon to explore our cultural artifacts!
            </p>
            <p className="text-sm text-gray-500">
              Museum administrators are currently adding artifacts to the collection.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={['All Categories', ...Array.from(new Set(artifacts.map(a => a.category)))]}
        />

        {/* Results count */}
        <div className="mb-4 sm:mb-6 px-2 sm:px-0">
          <p className="text-sm sm:text-base text-gray-600">
            {filteredArtifacts.length} {filteredArtifacts.length === 1 ? 'artifact' : 'artifacts'} found
          </p>
        </div>

        {/* Artifacts Grid */}
        {filteredArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArtifacts.map(artifact => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--museum-brown)' }}>
              No artifacts found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
