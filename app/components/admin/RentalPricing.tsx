'use client';

import { ChangeEvent } from 'react';
import { Currency, RentalPricing } from './types';
import { BadgeDollarSign, ChevronDown, Info } from 'lucide-react';

interface DomainData {
  domainName: string;
  pricing?: RentalPricing;
}

interface RentalPricingProps {
  pricing: RentalPricing;
  currencies: Currency[];
  onPricingChange: (field: keyof RentalPricing, value: string | number) => void;
  domains?: DomainData[];
  selectedDomainIndex?: number;
  onDomainSelect?: (index: number) => void;
}

export default function RentalPricingComponent({
  pricing,
  currencies,
  onPricingChange,
  domains = [],
  selectedDomainIndex = -1,
  onDomainSelect
}: RentalPricingProps) {
  // Find the selected currency by ID instead of code
  const selectedCurrency = currencies.find(c => c.id === pricing.currency) || currencies[0];

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currencyId = parseInt(e.target.value);
    onPricingChange('currency', currencyId);
  };

  const handleInputChange = (field: keyof Omit<RentalPricing, 'currency'>, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPricingChange(field, field === 'conversionRate' ? parseFloat(value) || 0 : value);
  };

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ring-1 ring-white/5 relative overflow-hidden group/card transition-all duration-300">
      {/* Accent Glow */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[rgb(var(--primary))]/10 rounded-full blur-3xl group-hover/card:bg-[rgb(var(--primary))]/20 transition-all duration-500" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-[rgb(var(--primary))]/20 rounded-lg text-[rgb(var(--primary))]">
            <BadgeDollarSign className="w-5 h-5" />
          </div>
          Pricing Matrix
        </h2>

        {domains && domains.length > 0 && onDomainSelect && (
          <div className="relative">
            <select
              value={selectedDomainIndex}
              onChange={(e) => onDomainSelect(parseInt(e.target.value))}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-300 focus:outline-none focus:ring-1 focus:ring-[rgb(var(--primary))]/50 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value={-1}>Global Default</option>
              {domains.map((domain, index) => (
                <option key={index} value={index}>
                  {domain.domainName}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Select Currency
            </label>
            <select
              value={pricing.currency}
              onChange={handleCurrencyChange}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all cursor-pointer"
            >
              {currencies.map((currency: Currency) => (
                <option key={currency.id} value={currency.id} className="bg-gray-900">
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 mt-2 ml-1">
              <span className="text-[rgb(var(--primary))] font-bold">{selectedCurrency.symbol}</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{selectedCurrency.name} Active</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Rate to USD Base
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.0001"
                value={pricing.conversionRate}
                onChange={(e) => handleInputChange('conversionRate', e)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-mono"
                placeholder="1.0"
              />
              <div className="absolute right-3 top-2 text-[10px] font-bold text-gray-500 pointer-events-none">
                {selectedCurrency.code}/USD
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Per Mile ({selectedCurrency.symbol})
              </label>
              <span className="text-[10px] font-black text-[rgb(var(--primary))] bg-[rgb(var(--primary))]/10 px-2 py-0.5 rounded border border-[rgb(var(--primary))]/10">IMPERIAL</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricing.rentPerMile}
                onChange={(e) => handleInputChange('rentPerMile', e)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-lg font-black text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-mono"
                placeholder="0.00"
              />
              <div className="absolute right-4 top-3 text-xs font-bold text-gray-600">
                ≈ ${(pricing.rentPerMile * pricing.conversionRate).toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Per Kilometer ({selectedCurrency.symbol})
              </label>
              <span className="text-[10px] font-black text-[rgb(var(--secondary))] bg-[rgb(var(--secondary))]/10 px-2 py-0.5 rounded border border-[rgb(var(--secondary))]/10">METRIC</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricing.rentPerKm}
                onChange={(e) => handleInputChange('rentPerKm', e)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-lg font-black text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-mono"
                placeholder="0.00"
              />
              <div className="absolute right-4 top-3 text-xs font-bold text-gray-600">
                ≈ ${(pricing.rentPerKm * pricing.conversionRate).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 relative z-10">
          <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Live Projections</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: '1 Kilometer', value: pricing.rentPerKm, usd: pricing.rentPerKm * pricing.conversionRate, color: 'text-[rgb(var(--primary))]' },
              { label: '1 Mile', value: pricing.rentPerMile, usd: pricing.rentPerMile * pricing.conversionRate, color: 'text-[rgb(var(--primary))]', sub: '(1.6 × Metric)' },
              { label: '10 Kilometers', value: pricing.rentPerKm * 10, usd: pricing.rentPerKm * 10 * pricing.conversionRate, color: 'text-[rgb(var(--primary))]' },
              { label: '10 Miles', value: pricing.rentPerMile * 10, usd: pricing.rentPerMile * 10 * pricing.conversionRate, color: 'text-[rgb(var(--primary))]' },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/15 transition-colors">
                <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{stat.label}</div>
                <div className={`text-lg font-black ${stat.color}`}>
                  {stat.value.toFixed(2)} {selectedCurrency.symbol}
                </div>
                <div className="text-[10px] font-medium text-gray-500 mt-0.5">
                  ≈ ${stat.usd.toFixed(2)} USD
                </div>
                {stat.sub && <div className="text-[8px] font-bold text-[rgb(var(--primary))]/50 mt-1">{stat.sub}</div>}
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-[rgb(var(--primary))]/10 rounded-xl border border-[rgb(var(--primary))]/20 flex items-start gap-3">
            <div className="p-1.5 bg-[rgb(var(--primary))]/20 rounded-lg">
              <Info className="w-4 h-4 text-[rgb(var(--primary))]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[rgb(var(--primary))] opacity-80 uppercase tracking-wider mb-0.5">Pricing Logic Active</p>
              <p className="text-[10px] text-[rgb(var(--primary))]/80 leading-relaxed uppercase tracking-tight font-medium">Rent per mile is strictly synchronized at 1.6x the kilometer base rate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}