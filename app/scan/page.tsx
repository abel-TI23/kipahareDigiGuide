'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanning) {
      setScanning(true);
      
      // Initialize scanner
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string) => {
        console.log('QR Code detected:', decodedText);
        
        // Stop scanning
        scanner.clear().catch(err => console.error('Error clearing scanner:', err));
        
        // Check if it's a URL to our artifacts
        try {
          const url = new URL(decodedText);
          const pathMatch = url.pathname.match(/\/artifacts\/(\d+)/);
          
          if (pathMatch) {
            const artifactId = pathMatch[1];
            router.push(`/artifacts/${artifactId}`);
          } else {
            // If not our artifact URL, try to open the link
            window.location.href = decodedText;
          }
        } catch (err) {
          // Not a valid URL, show error
          setError('Invalid QR code. Please scan a valid artifact QR code.');
          setTimeout(() => {
            setError(null);
            // Restart scanner
            scanner.render(onScanSuccess, onScanError);
          }, 3000);
        }
      };

      const onScanError = (errorMessage: string) => {
        // Ignore common scanning errors
        if (!errorMessage.includes('NotFoundException')) {
          console.warn('QR scan error:', errorMessage);
        }
      };

      scanner.render(onScanSuccess, onScanError);
    }

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error('Error clearing scanner:', err));
      }
    };
  }, [router, scanning]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--museum-cream)' }}>
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="text-2xl sm:text-3xl">🏛️</div>
              <div>
                <div className="font-bold text-base sm:text-lg" style={{ color: 'var(--museum-brown)' }}>
                  Ki Pahare DigiGuide
                </div>
                <p className="text-xs text-gray-600 hidden sm:block">QR Code Scanner</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border-2 hover:bg-gray-50 transition-all text-sm sm:text-base"
              style={{ borderColor: 'var(--museum-brown)', color: 'var(--museum-brown)' }}
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--museum-brown)' }}>
              Scan Artifact QR Code
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Position the QR code within the frame to scan
            </p>
          </div>

          {/* Scanner Container */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6">
            <div id="qr-reader" className="w-full"></div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="font-bold text-lg sm:text-xl mb-4" style={{ color: 'var(--museum-brown)' }}>
              How to Scan
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl" style={{ color: 'var(--museum-orange)' }}>1️⃣</span>
                <p>Allow camera access when prompted</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl" style={{ color: 'var(--museum-orange)' }}>2️⃣</span>
                <p>Position your device so the QR code fits within the frame</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl" style={{ color: 'var(--museum-orange)' }}>3️⃣</span>
                <p>Hold steady - the scanner will automatically detect the code</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl" style={{ color: 'var(--museum-orange)' }}>4️⃣</span>
                <p>You'll be redirected to the artifact details automatically</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-900">
              <strong>💡 Tip:</strong> Make sure you have good lighting and hold your phone steady for best results.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
