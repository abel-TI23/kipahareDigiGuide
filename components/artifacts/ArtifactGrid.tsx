'use client';

import { useState, useEffect } from 'react';
import ArtifactCard from '@/components/artifacts/ArtifactCard';
import SearchBar from '@/components/artifacts/SearchBar';
import type { Artifact } from '@/types';
import { dummyArtifacts } from '@/lib/dummy-data';

export default function ArtifactGrid() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState<Artifact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    setTimeout(() => {
      setArtifacts(dummyArtifacts);
      setFilteredArtifacts(dummyArtifacts);
      setLoading(false);
    }, 500);
  }, []);

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
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[var(--museum-orange)] border-t-transparent"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Loading treasures...</p>
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
