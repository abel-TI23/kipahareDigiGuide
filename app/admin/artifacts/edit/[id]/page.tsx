'use client';

/**
 * Ki Pahare DigiGuide - Edit Artifact
 * CRUD Update page for artifacts with improved validation
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Toast, { ToastType } from '@/components/ui/Toast';
import { ARTIFACT_CATEGORIES, VALIDATION } from '@/lib/constants';

export default function EditArtifactPage() {
  const router = useRouter();
  const params = useParams();
  const artifactId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    origin: '',
    year: '',
    description: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);

  useEffect(() => {
    fetchArtifact();
  }, [artifactId]);

  const fetchArtifact = async () => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const artifact = data.data;
        setFormData({
          name: artifact.name,
          category: artifact.category,
          origin: artifact.origin,
          year: artifact.year,
          description: artifact.description,
          imageUrl: artifact.image_url,
        });
      } else {
        setServerError('Artifact not found');
      }
    } catch (error) {
      console.error('Error fetching artifact:', error);
      setServerError('Failed to load artifact');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Year must be 4 digits';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/artifacts/${artifactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          origin: formData.origin,
          year: formData.year,
          description: formData.description,
          image_url: formData.imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update artifact');
      }

      setToast({ message: 'Artifact updated successfully!', type: 'success' });
      setTimeout(() => {
        router.push('/admin/artifacts/manage');
      }, 1500);
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update artifact', type: 'error' });
      setServerError(error.message || 'An error occurred while updating artifact');
    } finally {
      setSaving(false);
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

  if (serverError && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--museum-light-cream)' }}>
        <div className="text-center museum-card p-8">
          <p className="text-red-600 text-xl mb-4">{serverError}</p>
          <Link href="/admin/artifacts/manage" className="museum-btn-primary px-6 py-3 inline-block">
            ← Back to Manage Artifacts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--museum-light-cream)' }}>
      {/* Header */}
      <header className="museum-header shadow-md">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link href="/admin/artifacts/manage" className="flex items-center gap-3">
              <div className="bg-[var(--museum-orange)] text-white px-4 py-2 rounded-lg font-bold text-xl">
                KH
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                  Edit Artifact
                </div>
                <p className="text-xs md:text-sm text-gray-600">Ki Pahare DigiGuide</p>
              </div>
            </Link>
            <Link
              href="/admin/artifacts/manage"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm md:text-base text-gray-800 font-semibold"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="museum-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--museum-dark-brown)' }}>
              Edit Artifact #{artifactId}
            </h1>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Artifact Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                }`}
                placeholder="e.g., Kujang Pusaka"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  errors.category
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Origin and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="origin" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                  Origin *
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                    errors.origin
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                  }`}
                  placeholder="e.g., Bandung, Jawa Barat"
                />
                {errors.origin && (
                  <p className="mt-1 text-sm text-red-600">{errors.origin}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                  Year *
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                    errors.year
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                  }`}
                  placeholder="e.g., 1850"
                  maxLength={4}
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                }`}
                placeholder="Describe the artifact..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length} characters (minimum 10)
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Image URL *
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  errors.imageUrl
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                }`}
                placeholder="/images/artifacts/artifact-name.jpg"
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
              )}
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                  Image Preview:
                </p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="max-w-full h-64 object-cover rounded mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="museum-btn-primary flex-1 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : (
                  '💾 Save Changes'
                )}
              </button>
              <Link
                href="/admin/artifacts/manage"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-center font-semibold text-gray-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
