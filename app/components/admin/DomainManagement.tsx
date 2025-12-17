'use client';

import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { DomainData } from './types';

interface DomainManagementProps {
  domains: DomainData[];
  newDomain: string;
  onNewDomainChange: (value: string) => void;
  onAddDomain: () => Promise<boolean>; // Changed to async
  onRemoveDomain: (index: number) => void;
  onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
  domainError?: string;
  onClearDomainError?: () => void;
  checkingDomain?: boolean;
}

export default function DomainManagement({
  domains,
  newDomain,
  onNewDomainChange,
  onAddDomain,
  onRemoveDomain,
  onKeyPress,
  domainError,
  onClearDomainError,
  checkingDomain = false
}: DomainManagementProps) {
  const [localError, setLocalError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleAddDomainClick = async () => {
    // Clear any existing errors
    setLocalError('');
    if (onClearDomainError) onClearDomainError();
    
    // Basic validation
    if (!newDomain.trim()) {
      setLocalError('Please enter a domain name');
      return;
    }
    
    // Basic domain validation
    const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!domainPattern.test(newDomain.trim())) {
      setLocalError('Please enter a valid domain name (e.g., example.com)');
      return;
    }
    
    setIsChecking(true);
    
    try {
      // Call the parent handler which should check with the API
      const success = await onAddDomain();
      
      if (!success) {
        // Error will be set by parent component
        return;
      }
      
      // If successful, error will already be cleared
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onNewDomainChange(e.target.value);
    // Clear error when user starts typing
    if (localError) setLocalError('');
    if (domainError && onClearDomainError) onClearDomainError();
  };

  const handleKeyPressInternal = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDomainClick();
    } else {
      onKeyPress(e);
    }
  };

  return (
    <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-5 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full"></span>
          Domain Management
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {domains.length} domain(s)
        </span>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newDomain}
                onChange={handleInputChange}
                onKeyPress={handleKeyPressInternal}
                placeholder="Enter domain name (e.g., example.com)"
                className={`w-full bg-white border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-10 ${
                  localError || domainError ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isChecking || checkingDomain}
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
                </svg>
              </div>
              {(isChecking || checkingDomain) && (
                <div className="absolute right-3 top-3.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleAddDomainClick}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500 rounded-lg font-medium text-white hover:from-purple-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 shadow flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newDomain.trim() || isChecking || checkingDomain}
            >
              {(isChecking || checkingDomain) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Checking...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Domain
                </>
              )}
            </button>
          </div>
          
          {/* Error message for duplicate domain */}
          {(localError || domainError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{localError || domainError}</span>
              </div>
            </div>
          )}
          
          {/* Domain validation tips */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> System will check if domain already exists for any user before adding.
            </p>
          </div>
        </div>
        
        {domains.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Domain Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {domains.map((domain: DomainData, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {domain.domainName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        domain.status === 'active' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : domain.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {domain.expiryDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <button
                        onClick={() => onRemoveDomain(index)}
                        className="text-red-600 hover:text-red-800 font-medium hover:underline transition-colors duration-200 flex items-center"
                        disabled={isChecking || checkingDomain}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Note:</span> You have {domains.length} domain{domains.length !== 1 ? 's' : ''} in the list. 
                The system checks if domains exist globally before adding.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
            </svg>
            <p className="text-gray-600">No domains added yet. Add your first domain above.</p>
            <p className="text-sm text-gray-500 mt-2">Example: example.com, yourdomain.net, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
}