'use client';

import { RentalPricing, Currency } from './types';
import { useTheme } from '../ThemeProvider';
import { Coins, ShieldCheck } from 'lucide-react';

interface InfoPanelProps {
  pricing: RentalPricing;
  currencies: Currency[]; // Added this prop
}

export default function InfoPanel({ pricing, currencies }: InfoPanelProps) {
  useTheme();
  // Find the currency by ID
  const selectedCurrency = currencies.find(c => c.id === pricing.currency) || currencies[0];

  return (
    <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden group/info">
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary))]/5 to-[rgb(var(--secondary))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black text-[rgb(var(--primary))] border border-[rgb(var(--primary))]/30 px-2 py-0.5 rounded uppercase tracking-[0.2em] bg-[rgb(var(--primary))]/10">System Briefing</span>
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">Pricing Logic & Protocol</h3>
          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-4xl">
            Protocol synchronized: <span className="text-[rgb(var(--primary))] font-black">1 KM = {pricing.rentPerKm.toFixed(2)} {selectedCurrency.symbol}</span>
            <span className="mx-2 opacity-30">|</span>
            <span className="text-[rgb(var(--secondary))] font-black">1 MILE = {pricing.rentPerMile.toFixed(2)} {selectedCurrency.symbol}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Coins className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Active Currency:</span>
              <span className="text-[11px] font-black text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg uppercase">
                {selectedCurrency.name} ({selectedCurrency.code})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Base Integrity:</span>
              <span className="text-[11px] font-black text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/10 px-2.5 py-1 rounded-lg uppercase">
                Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 tracking-tighter">
              {(pricing.rentPerMile / pricing.rentPerKm).toFixed(2)}
            </span>
            <span className="text-xs font-black text-[rgb(var(--primary))] uppercase">:1</span>
          </div>
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Efficiency Coefficient</div>
        </div>
      </div>
    </div>
  );
}