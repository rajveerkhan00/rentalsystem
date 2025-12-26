'use client';

import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { themes } from '@/lib/themes';
import { DomainData } from './types';
import { useTheme } from '../ThemeProvider';

interface DomainManagementProps {
  domains: DomainData[];
  newDomain: string;
  onNewDomainChange: (value: string) => void;
  onAddDomain: () => Promise<boolean>;
  onRemoveDomain: (index: number) => void;
  onUpdateDomainTheme: (index: number, themeId: string) => void; // ADDED
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
  onUpdateDomainTheme,
  onKeyPress,
  domainError,
  onClearDomainError,
  checkingDomain = false
}: DomainManagementProps) {
  useTheme();
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
    <div className="lg:col-span-2 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ring-1 ring-white/5 relative overflow-hidden group/card transition-all duration-300">
      {/* Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[rgb(var(--primary))]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-[rgb(var(--primary))]/20 rounded-lg text-[rgb(var(--primary))]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
            </svg>
          </div>
          Domain Network
        </h2>
        <span className="text-[10px] font-black text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
          {domains.length} NODES {domains.length === 1 ? 'DEPLOYED' : 'DEPLOYED'}
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group/input">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Register New Domain
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newDomain}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPressInternal}
                  placeholder="Enter domain name (e.g., example.com)"
                  className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all duration-300 pl-11 group-hover/input:border-white/20 ${localError || domainError ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10'
                    }`}
                  disabled={isChecking || checkingDomain}
                />
                <div className="absolute left-4 top-3.5 text-gray-600 group-hover/input:text-[rgb(var(--primary))] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                {(isChecking || checkingDomain) && (
                  <div className="absolute right-4 top-3.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[rgb(var(--primary))] border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddDomainClick}
                className="w-full md:w-auto px-8 py-3 bg-[rgb(var(--primary))] hover:brightness-110 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl font-black text-white transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30_rgba(var(--primary),0.5)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={!newDomain.trim() || isChecking || checkingDomain}
              >
                {(isChecking || checkingDomain) ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Add Node</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Messaging Area */}
          <div className="flex flex-col gap-3">
            {(localError || domainError) && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-1.5 bg-red-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-red-200 uppercase tracking-tight">{localError || domainError}</span>
              </div>
            )}

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.1em]">
                Global distribution check enabled. Duplicate nodes across the network are restricted.
              </p>
            </div>
          </div>
        </div>

        {domains.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md relative z-10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Domain Asset</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Visual Theme</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Health</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {domains.map((domain: DomainData, index: number) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors duration-300 group/row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover/row:border-[rgb(var(--primary))]/30 transition-colors">
                            <span className="text-[10px] font-black text-[rgb(var(--primary))]">{domain.domainName.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-200">{domain.domainName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative group/select min-w-[160px]">
                          <select
                            value={domain.themeId || 'default'}
                            onChange={(e) => onUpdateDomainTheme(index, e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-lg pl-8 pr-4 py-1.5 text-[10px] font-black text-white hover:border-[rgb(var(--primary))]/30 focus:outline-none focus:ring-1 focus:ring-[rgb(var(--primary))]/50 transition-all appearance-none uppercase tracking-widest cursor-pointer"
                          >
                            {themes.map((t) => (
                              <option key={t.id} value={t.id} className="bg-[#0A0A0A] text-white">
                                {t.name}
                              </option>
                            ))}
                          </select>
                          <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/10 shadow-lg`}
                            style={{ background: `rgb(${(themes.find(t => t.id === (domain.themeId || 'default'))?.colors['--primary']) || '236 72 153'})` }}
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${domain.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : domain.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-[rgb(var(--secondary))]/10 text-[rgb(var(--secondary))] border-[rgb(var(--secondary))]/20'
                          }`}>
                          <div className={`w-1 h-1 rounded-full animate-pulse ${domain.status === 'active' ? 'bg-emerald-400' : domain.status === 'pending' ? 'bg-amber-400' : 'bg-[rgb(var(--secondary))]'
                            }`} />
                          {domain.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onRemoveDomain(index)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgb(var(--secondary))]/10 border border-[rgb(var(--secondary))]/20 text-[rgb(var(--secondary))] hover:bg-[rgb(var(--secondary))] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-tighter group/btn"
                          disabled={isChecking || checkingDomain}
                        >
                          <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Decommission
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white/5 px-6 py-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 bg-[rgb(var(--primary))] rounded-full" />
                Network Integrity: {domains.length} NODES VERIFIED • SECURITY PROTOCOL 4.2 ACTIVE
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl relative z-10 bg-white/[0.02]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Active Nodes</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">The domain network is currently empty. Initialize your first node deployment above.</p>
          </div>
        )}
      </div>
    </div>
  );
}