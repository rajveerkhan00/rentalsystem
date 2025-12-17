'use client';

import { ChangeEvent } from 'react';
import { Currency, RentalPricing } from './types';

interface RentalPricingProps {
  pricing: RentalPricing;
  currencies: Currency[];
  onPricingChange: (field: keyof RentalPricing, value: string | number) => void;
}

export default function RentalPricingComponent({ pricing, currencies, onPricingChange }: RentalPricingProps) {
  const selectedCurrency = currencies.find(c => c.code === pricing.currency);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <span className="w-2 h-5 bg-gradient-to-b from-green-500 to-green-700 rounded-full"></span>
        Rental Pricing Configuration
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={pricing.currency}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => onPricingChange('currency', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {currencies.map((currency: Currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency to USD Rate
            </label>
            <input
              type="number"
              step="0.0001"
              value={pricing.conversionRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onPricingChange('conversionRate', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="1.0"
            />
            <p className="text-xs text-gray-500 mt-1">
              1 {pricing.currency} = {pricing.conversionRate} USD
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Rent Per Mile ({selectedCurrency?.symbol})
              </label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Imperial</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricing.rentPerMile}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onPricingChange('rentPerMile', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-2">
              Default: 1 mile = 1.6 × (1 km rent)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ≈ ${(pricing.rentPerMile * pricing.conversionRate).toFixed(2)} USD
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Rent Per Kilometer ({selectedCurrency?.symbol})
              </label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Metric</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricing.rentPerKm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onPricingChange('rentPerKm', e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-2">
              Default: 1 km = $1.00
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ≈ ${(pricing.rentPerKm * pricing.conversionRate).toFixed(2)} USD
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Conversion Rate: 1 km = $1, 1 mile = $1.6</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white/50 rounded-lg border border-gray-200">
              <div className="text-gray-600 mb-1">1 Kilometer</div>
              <div className="text-green-600 font-medium">
                {pricing.rentPerKm.toFixed(2)} {pricing.currency}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${(pricing.rentPerKm * pricing.conversionRate).toFixed(2)} USD
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg border border-gray-200">
              <div className="text-gray-600 mb-1">1 Mile</div>
              <div className="text-green-600 font-medium">
                {pricing.rentPerMile.toFixed(2)} {pricing.currency}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${(pricing.rentPerMile * pricing.conversionRate).toFixed(2)} USD
              </div>
              <div className="text-xs text-blue-600 mt-1">
                (1.6 × 1 km rent)
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg border border-gray-200">
              <div className="text-gray-600 mb-1">10 Kilometers</div>
              <div className="text-green-600 font-medium">
                {(pricing.rentPerKm * 10).toFixed(2)} {pricing.currency}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${(pricing.rentPerKm * 10 * pricing.conversionRate).toFixed(2)} USD
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-lg border border-gray-200">
              <div className="text-gray-600 mb-1">10 Miles</div>
              <div className="text-green-600 font-medium">
                {(pricing.rentPerMile * 10).toFixed(2)} {pricing.currency}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ${(pricing.rentPerMile * 10 * pricing.conversionRate).toFixed(2)} USD
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center text-sm text-blue-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span><strong>Conversion Logic:</strong> Rent per mile is automatically calculated as 1.6 times the rent per kilometer.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}