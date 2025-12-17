'use client';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-800 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-700">Loading Dashboard...</p>
      </div>
    </div>
  );
}