/**
 * Admin Dashboard - Responsive Design
 * Main dashboard for managing artifacts
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats] = useState({
    totalArtifacts: 12,
    totalScans: 234,
    totalVisitors: 1547,
    avgRating: 4.8,
  });

  const recentArtifacts = [
    { id: 1, name: 'Kujang Pusaka', category: 'Senjata', date: '2025-10-28' },
    { id: 2, name: 'Angklung Tradisional', category: 'Alat Musik', date: '2025-10-27' },
    { id: 3, name: 'Wayang Golek', category: 'Seni Pertunjukan', date: '2025-10-26' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--museum-light-cream)' }}>
      {/* Header Navigation */}
      <header className="museum-header shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-[var(--museum-orange)] text-white px-4 py-2 rounded-lg font-bold text-xl">
                  TH
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                    Admin Dashboard
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">Kipahare DigiGuide</p>
                </div>
              </Link>
              
              {/* Mobile Menu Button */}
              <button className="md:hidden p-2">
                <span className="text-2xl">☰</span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col md:flex-row gap-2 md:gap-4">
              <Link 
                href="/admin/dashboard" 
                className="px-4 py-2 rounded-lg font-semibold transition-all"
                style={{ background: 'var(--museum-orange)', color: 'white' }}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/artifacts" 
                className="px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all"
                style={{ color: 'var(--museum-brown)' }}
              >
                Artifacts
              </Link>
              <Link 
                href="/admin/qr-codes" 
                className="px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all"
                style={{ color: 'var(--museum-brown)' }}
              >
                QR Codes
              </Link>
              <button 
                className="px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-all text-red-600 text-left md:text-center"
                onClick={() => window.location.href = '/login'}
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--museum-brown)' }}>
            Welcome back, Admin
          </h1>
          <p className="text-gray-600">Here's what's happening with your museum today.</p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Artifacts */}
          <div className="museum-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🏛️</div>
              <div className="text-sm font-semibold px-3 py-1 rounded-full"
                   style={{ background: 'var(--museum-light-cream)', color: 'var(--museum-brown)' }}>
                +12%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Artifacts</h3>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--museum-brown)' }}>
              {stats.totalArtifacts}
            </p>
          </div>

          {/* Total Scans */}
          <div className="museum-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📱</div>
              <div className="text-sm font-semibold px-3 py-1 rounded-full"
                   style={{ background: 'var(--museum-light-cream)', color: 'var(--museum-brown)' }}>
                +23%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">QR Scans</h3>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--museum-brown)' }}>
              {stats.totalScans}
            </p>
          </div>

          {/* Total Visitors */}
          <div className="museum-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👥</div>
              <div className="text-sm font-semibold px-3 py-1 rounded-full"
                   style={{ background: 'var(--museum-light-cream)', color: 'var(--museum-brown)' }}>
                +8%
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Visitors</h3>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--museum-brown)' }}>
              {stats.totalVisitors}
            </p>
          </div>

          {/* Average Rating */}
          <div className="museum-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">⭐</div>
              <div className="text-sm font-semibold px-3 py-1 rounded-full"
                   style={{ background: 'var(--museum-light-cream)', color: 'var(--museum-brown)' }}>
                +0.3
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Avg. Rating</h3>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--museum-brown)' }}>
              {stats.avgRating}
            </p>
          </div>
        </div>

        {/* Two Column Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Artifacts */}
          <div className="museum-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                Recent Artifacts
              </h2>
              <Link href="/admin/artifacts" className="text-sm font-semibold hover:underline"
                    style={{ color: 'var(--museum-orange)' }}>
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentArtifacts.map((artifact) => (
                <div key={artifact.id} 
                     className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-all"
                     style={{ background: 'var(--museum-light-cream)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                         style={{ background: 'white' }}>
                      🏛️
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--museum-brown)' }}>
                        {artifact.name}
                      </h3>
                      <p className="text-sm text-gray-600">{artifact.category}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 hidden sm:block">{artifact.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="museum-card p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: 'var(--museum-brown)' }}>
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-6 rounded-lg text-left hover:shadow-lg transition-all"
                      style={{ background: 'var(--museum-light-cream)' }}>
                <div className="text-3xl mb-3">➕</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--museum-brown)' }}>
                  Add Artifact
                </h3>
                <p className="text-sm text-gray-600">Create new artifact entry</p>
              </button>

              <button className="p-6 rounded-lg text-left hover:shadow-lg transition-all"
                      style={{ background: 'var(--museum-light-cream)' }}>
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--museum-brown)' }}>
                  View Reports
                </h3>
                <p className="text-sm text-gray-600">Analytics & insights</p>
              </button>

              <button className="p-6 rounded-lg text-left hover:shadow-lg transition-all"
                      style={{ background: 'var(--museum-light-cream)' }}>
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--museum-brown)' }}>
                  Generate QR
                </h3>
                <p className="text-sm text-gray-600">Create QR codes</p>
              </button>

              <button className="p-6 rounded-lg text-left hover:shadow-lg transition-all"
                      style={{ background: 'var(--museum-light-cream)' }}>
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--museum-brown)' }}>
                  Settings
                </h3>
                <p className="text-sm text-gray-600">Manage preferences</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
