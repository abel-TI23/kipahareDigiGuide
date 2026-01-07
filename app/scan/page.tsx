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
  const [permissionStatus, setPermissionStatus] = useState<string>('checking');

  useEffect(() => {
    const initializeScanner = async () => {
      if (scanning) return;
      
      try {
        // Request camera permission explicitly
        setPermissionStatus('requesting');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Stop the stream immediately after getting permission
        stream.getTracks().forEach(track => track.stop());
        
        setPermissionStatus('granted');
        setScanning(true);
        
        // Initialize scanner after permission granted
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

        try {
          scanner.render(onScanSuccess, onScanError);
        } catch (err: any) {
          console.error('Failed to start scanner:', err);
          setError(`Scanner error: ${err.message || 'Unable to start scanner'}`);
          setScanning(false);
          setPermissionStatus('error');
        }
      } catch (err: any) {
        console.error('Camera permission error:', err);
        setPermissionStatus('denied');
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please ensure your device has a camera.');
        } else {
          setError(`Camera error: ${err.message || 'Unable to access camera'}`);
        }
        setScanning(false);
      }
    };

    initializeScanner();

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
            {permissionStatus === 'checking' && (
              <div className="text-center py-8">
                <p className="text-gray-600">Checking camera availability...</p>
              </div>
            )}
            
            {permissionStatus === 'requesting' && (
              <div className="text-center py-8">
                <p className="text-blue-600 font-semibold mb-2">📸 Camera Permission Required</p>
                <p className="text-gray-600 text-sm">Please allow camera access in the browser prompt</p>
              </div>
            )}
            
            {permissionStatus === 'denied' && (
              <div className="text-center py-8">
                <p className="text-red-600 font-semibold mb-2">❌ Camera Access Denied</p>
                <p className="text-gray-600 text-sm mb-4">Please enable camera in your browser settings and refresh the page</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}
            
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
