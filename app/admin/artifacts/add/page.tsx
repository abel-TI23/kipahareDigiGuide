'use client';

/**
 * Ki Pahare DigiGuide - Add New Artifact
 * CRUD Create page with Image Upload to Supabase Storage
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Toast, { ToastType } from '@/components/ui/Toast';
import { ARTIFACT_CATEGORIES, VALIDATION } from '@/lib/constants';
import { supabaseStorage } from '@/lib/supabase';

export default function AddArtifactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    origin: '',
    year: '',
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        image: 'Please select a valid image file (JPG, PNG, or WebP)' 
      }));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        image: 'Image size must be less than 5MB' 
      }));
      return;
    }

    // Clear image error
    setErrors(prev => {
      const { image, ...rest } = prev;
      return rest;
    });

    // Set file and create preview
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear manual URL if file is selected
    if (formData.imageUrl) {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
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
    } else {
      const yearNum = parseInt(formData.year);
      if (yearNum < VALIDATION.YEAR_MIN || yearNum > VALIDATION.YEAR_MAX) {
        newErrors.year = `Year must be between ${VALIDATION.YEAR_MIN} and ${VALIDATION.YEAR_MAX}`;
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Image validation - either file or URL must be provided
    // This is checked separately in handleSubmit

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    if (!url) return true; // Allow empty for optional field
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  const handleImageUrlBlur = async () => {
    if (!formData.imageUrl.trim()) return;
    
    setIsValidatingImage(true);
    const isValid = await validateImageUrl(formData.imageUrl);
    setIsValidatingImage(false);
    
    if (!isValid) {
      setErrors(prev => ({ 
        ...prev, 
        imageUrl: 'Invalid image URL or image failed to load' 
      }));
    }
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

    // Check if image is provided (either file or URL)
    if (!imageFile && !formData.imageUrl.trim()) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image or provide an image URL' }));
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image file if selected
      if (imageFile) {
        setUploadProgress(25);
        try {
          imageUrl = await supabaseStorage.uploadImage(imageFile);
          setUploadProgress(75);
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
      }

      setUploadProgress(80);

      const response = await fetch('/api/artifacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          origin: formData.origin,
          year: formData.year,
          description: formData.description,
          image_url: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add artifact');
      }

      setUploadProgress(100);
      setToast({ message: 'Artifact added successfully!', type: 'success' });
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Submit error:', error);
      setToast({ message: error.message || 'Failed to add artifact', type: 'error' });
      setServerError(error.message || 'An error occurred while adding artifact');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--museum-light-cream)' }}>
      {/* Header */}
      <header className="museum-header shadow-md">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="bg-[var(--museum-orange)] text-white px-4 py-2 rounded-lg font-bold text-xl">
                KP
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                  Add New Artifact
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
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="museum-card p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--museum-dark-brown)' }}>
            Create New Artifact
          </h1>

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
                {ARTIFACT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="text-gray-900 bg-white">
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Origin and Year - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Origin */}
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

              {/* Year */}
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
                placeholder="Describe the artifact, its history, and significance..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.description.length} characters (minimum 10)
              </p>
            </div>

            {/* Image Upload (Priority) */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                Artifact Image *
              </label>
              
              {/* File Upload Area */}
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[var(--museum-orange)] bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="imageFile" className="cursor-pointer">
                    <div className="space-y-2">
                      <div className="text-4xl">📷</div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--museum-brown)' }}>
                          Click to upload artifact image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported: JPEG, PNG, WebP • Max size: 5MB
                        </p>
                      </div>
                      {imageFile && (
                        <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          ✓ {imageFile.name}
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--museum-brown)' }}>Uploading...</span>
                      <span className="font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadProgress}%`,
                          background: 'var(--museum-orange)',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="border rounded-lg p-4 bg-white">
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--museum-brown)' }}>
                      Preview:
                    </p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-64 object-cover rounded mx-auto border"
                    />
                  </div>
                )}

                {/* Error Message */}
                {errors.image && (
                  <p className="text-sm text-red-600">{errors.image}</p>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-gray-300" />
                  <span className="text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300" />
                </div>

                {/* Optional Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-2 text-gray-600">
                    Use Image URL (optional)
                  </label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    onBlur={handleImageUrlBlur}
                    disabled={!!imageFile}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                      imageFile
                        ? 'opacity-50 cursor-not-allowed'
                        : errors.imageUrl
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[var(--museum-orange)]'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {isValidatingImage && (
                    <p className="mt-1 text-sm text-blue-600">Validating image...</p>
                  )}
                  {errors.imageUrl && !imageFile && (
                    <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                  )}
                  {imageFile && (
                    <p className="mt-1 text-xs text-gray-500">
                      Image file selected. Clear the file to use URL instead.
                    </p>
                  )}
                </div>
              </div>
            </div>
            

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="museum-btn-primary flex-1 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating...
                  </span>
                ) : (
                  '✓ Create Artifact'
                )}
              </button>
              <Link
                href="/admin/dashboard"
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
