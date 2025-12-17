'use client';

/**
 * Ki Pahare DigiGuide - Manage Artifacts
 * CRUD Read/List page with Edit and Delete actions
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast, { ToastType } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Skeleton from '@/components/ui/Skeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { ARTIFACT_CATEGORIES } from '@/lib/constants';

interface Artifact {
  id: number;
  name: string;
  category: string;
  origin: string;
  year: string;
  description: string;
  image_url: string;
}

export default function ManageArtifactsPage() {
  const router = useRouter();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: number; name: string }>({ isOpen: false, id: 0, name: '' });

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/artifacts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch artifacts');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setArtifacts(data.data?.artifacts || []);
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error(data.error || 'Failed to load artifacts');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Auto retry max 3 times
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          fetchArtifacts();
        }, 2000); // Retry after 2 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setConfirmModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    const { id, name } = confirmModal;
    
    try {
      const response = await fetch(`/api/artifacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setToast({ message: `"${name}" deleted successfully!`, type: 'success' });
        fetchArtifacts(); // Refresh list
      } else {
        const data = await response.json();
        setToast({ message: data.error || 'Failed to delete artifact', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting artifact:', error);
      setToast({ message: 'An error occurred while deleting', type: 'error' });
    }
  };

  const downloadQRCode = async (artifactId: number, artifactName: string) => {
    try {
      const response = await fetch('/api/qr-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artifactId }),
      });

      const data = await response.json();

      if (data.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = data.qrImage;
        link.download = `QR-${artifactName.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setToast({ message: 'QR code downloaded successfully!', type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to generate QR code', type: 'error' });
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      setToast({ message: 'An error occurred while generating QR code', type: 'error' });
    }
  };

  // Filter artifacts
  const filteredArtifacts = artifacts.filter(artifact => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artifact.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || artifact.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(artifacts.map(a => a.category)));

  return (
    <div className="min-h-screen" style={{ background: 'var(--museum-light-cream)' }}>
      {/* Header */}
      <header className="museum-header shadow-md">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="bg-[var(--museum-orange)] text-white px-4 py-2 rounded-lg font-bold text-xl">
                KH
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                  Manage Artifacts
                </div>
                <p className="text-xs md:text-sm text-gray-600">Ki Pahare DigiGuide</p>
              </div>
            </Link>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm md:text-base text-gray-800 font-semibold"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--museum-dark-brown)' }}>
              All Artifacts
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredArtifacts.length} artifact{filteredArtifacts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Link
            href="/admin/artifacts/add"
            className="museum-btn-primary px-6 py-3 text-center whitespace-nowrap"
          >
            + Add New Artifact
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="museum-card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--museum-orange)] text-gray-900 bg-white"
                placeholder="Search by name or description..."
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--museum-orange)] text-gray-900 bg-white"
              >
                <option value="">All Categories</option>
                {ARTIFACT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="text-gray-900 bg-white">{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Artifacts List */}
        {loading ? (
          <Skeleton count={6} type="card" />
        ) : error ? (
          <ErrorDisplay 
            message={error} 
            onRetry={() => {
              setRetryCount(0);
              fetchArtifacts();
            }}
          />
        ) : filteredArtifacts.length === 0 ? (
          <div className="museum-card p-12 text-center">
            <p className="text-gray-600 text-lg">No artifacts found</p>
            <Link
              href="/admin/artifacts/add"
              className="inline-block mt-4 museum-btn-primary px-6 py-3"
            >
              Add Your First Artifact
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArtifacts.map((artifact) => (
              <div key={artifact.id} className="museum-card p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image */}
                  <div className="w-full md:w-48 h-48 flex-shrink-0">
                    <img
                      src={artifact.image_url}
                      alt={artifact.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-dark-brown)' }}>
                          {artifact.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="museum-badge">{artifact.category}</span>
                          <span className="text-sm text-gray-600">
                            📍 {artifact.origin}
                          </span>
                          <span className="text-sm text-gray-600">
                            📅 {artifact.year}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: #{artifact.id}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {artifact.description}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/artifacts/edit/${artifact.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(artifact.id, artifact.name)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={() => downloadQRCode(artifact.id, artifact.name)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        📥 Download QR
                      </button>
                      <Link
                        href={`/artifacts/${artifact.id}`}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm font-semibold"
                        target="_blank"
                      >
                        👁️ View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Artifact"
        message={`Are you sure you want to delete "${confirmModal.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: 0, name: '' })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
