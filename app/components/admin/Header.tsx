'use client';

import { SessionUser } from './types';

interface HeaderProps {
  user: SessionUser;
  dashboardData: any;
  saving: boolean;
  onSave: () => void;
  onLogout: () => void;
}

export default function Header({ user, dashboardData, saving, onSave, onLogout }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Rental System Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Admin: {user?.email} • Last updated: {dashboardData.lastUpdated.toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-lg text-sm font-medium text-white hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 transition-all duration-200 shadow"
          >
            {saving ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 border border-red-500 rounded-lg text-sm font-medium text-white hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}