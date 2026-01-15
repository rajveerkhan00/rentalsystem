'use client';

import { ChevronDown, Loader2, Save, LogOut } from 'lucide-react';
import { SessionUser } from './types';
import { themes } from '@/lib/themes';

interface HeaderProps {
  user: SessionUser;
  dashboardData: any;
  saving: boolean;
  onSave: () => void;
  onLogout: () => void;
  onDefaultThemeChange: (themeId: string) => void; // ADDED
}

export default function Header({ user, dashboardData, saving, onSave, onLogout, onDefaultThemeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--primary))] to-[rgb(var(--gradient-to))] animate-gradient-x uppercase italic">
            Control Center
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--primary))] animate-pulse"></div>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest">
              SECURE ACCESS • {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          {/* Global Theme Selector */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full h-[40px]">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Global Theme</span>
            <div className="relative group/select min-w-[140px]">
              <select
                value={dashboardData.defaultTheme || 'default'}
                onChange={(e) => onDefaultThemeChange(e.target.value)}
                className="w-full bg-transparent text-[10px] font-black text-white focus:outline-none appearance-none uppercase tracking-widest cursor-pointer pl-6 pr-4"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0A0A0A] text-white">
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/10 shadow-lg"
                style={{ background: `rgb(${themes.find(t => t.id === (dashboardData.defaultTheme || 'default'))?.colors['--primary'] || '236 72 153'})` }} />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                <ChevronDown className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={saving}
            className="relative group px-4 md:px-6 py-2 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] disabled:opacity-50 hover:-translate-y-0.5 h-[40px] flex items-center"
          >
            <div className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-tight">
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin border-black/30 text-black" />
                  <span>Syncing</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Commit Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </div>
          </button>

          <button
            onClick={onLogout}
            className="p-2 md:px-4 md:py-2 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10 text-xs font-black uppercase tracking-tight group h-[40px]"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}