/**
 * Kipahare DigiGuide - Landing Page
 * Welcome page with QR scanner and artifact browser
 */

import Link from 'next/link';
import ArtifactGrid from '../components/artifacts/ArtifactGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--museum-light-cream)' }}>
      {/* Header */}
      <header className="museum-header shadow-md">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="bg-[var(--museum-orange)] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold text-lg sm:text-xl">
                KH
              </div>
              <div className="flex-1 sm:flex-initial">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: 'var(--museum-brown)' }}>
                  Kipahare DigiGuide
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Digital Museum Collection</p>
              </div>
              {/* Mobile menu button placeholder */}
              <button className="sm:hidden p-2 text-2xl" style={{ color: 'var(--museum-brown)' }}>
                ☰
              </button>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/scan"
                className="museum-btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-initial py-2 sm:py-3 text-sm sm:text-base"
              >
                <span>📱</span>
                <span>Scan QR</span>
              </Link>
              <button className="px-3 sm:px-4 py-2 border-2 rounded-lg hover:bg-white transition-all" 
                      style={{ borderColor: 'var(--museum-orange)', color: 'var(--museum-orange)' }}>
                🌐
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 md:py-16 px-4" style={{ background: 'linear-gradient(135deg, var(--museum-cream) 0%, var(--museum-light-cream) 100%)' }}>
        <div className="container mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4" style={{ color: 'var(--museum-brown)' }}>
            Explore Historical Treasures
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-4" style={{ color: 'var(--museum-dark-brown)' }}>
            Discover ancient artifacts, scan QR codes for detailed insights, and immerse yourself in history
          </p>
        </div>
      </section>

      {/* Artifacts Grid Section */}
      <ArtifactGrid />

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 px-4" style={{ background: 'white' }}>
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 px-4" style={{ color: 'var(--museum-brown)' }}>
            How to Use
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white"
                   style={{ background: 'var(--museum-orange)' }}>
                1
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3" style={{ color: 'var(--museum-brown)' }}>Find QR Code</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Look for QR code labels on artifacts you want to learn about
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white"
                   style={{ background: 'var(--museum-orange)' }}>
                2
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3" style={{ color: 'var(--museum-brown)' }}>Scan with Camera</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Open scanner and point your camera at the QR code
              </p>
            </div>
            <div className="text-center p-4 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white"
                   style={{ background: 'var(--museum-orange)' }}>
                3
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3" style={{ color: 'var(--museum-brown)' }}>Explore Information</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Enjoy detailed information about that artifact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 text-center px-4" style={{ background: 'var(--museum-dark-brown)', color: 'white' }}>
        <div className="container mx-auto">
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">
            &copy; 2025 Kipahare DigiGuide. Museum Digital Innovation.
          </p>
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
          >
            Admin Login
          </Link>
        </div>
      </footer>
    </main>
  );
}
