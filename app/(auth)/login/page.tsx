/**
 * Login Page - Responsive Design with NextAuth
 * Beautiful login page with museum theme
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username or password');
        setIsLoading(false);
      } else if (result?.ok) {
        // Login successful
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" 
         style={{ background: 'linear-gradient(135deg, var(--museum-cream) 0%, var(--museum-light-cream) 100%)' }}>
      
      {/* Login Card */}
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-[var(--museum-orange)] text-white px-6 py-3 rounded-lg font-bold text-2xl">
                KP
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--museum-brown)' }}>
              Ki Pahare DigiGuide
            </h1>
            <p className="text-gray-600 mt-2">Museum Admin Portal</p>
          </Link>
        </div>

        {/* Login Form Card */}
        <div className="museum-card p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2" 
              style={{ color: 'var(--museum-brown)' }}>
            Admin Login
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your credentials to access the dashboard
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold mb-2" 
                     style={{ color: 'var(--museum-brown)' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                style={{ borderColor: '#E0D5C7' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--museum-orange)'}
                onBlur={(e) => e.target.style.borderColor = '#E0D5C7'}
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2" 
                     style={{ color: 'var(--museum-brown)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900"
                style={{ borderColor: '#E0D5C7' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--museum-orange)'}
                onBlur={(e) => e.target.style.borderColor = '#E0D5C7'}
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-semibold hover:underline" 
                 style={{ color: 'var(--museum-orange)' }}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full museum-btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold hover:underline"
                style={{ color: 'var(--museum-orange)' }}
              >
                Register here
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-gray-600 hover:underline text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-sm mt-6">
          For authorized museum staff only
        </p>
      </div>
    </div>
  );
}
