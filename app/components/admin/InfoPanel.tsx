'use client';

import { RentalPricing, Currency } from './types';

interface InfoPanelProps {
  pricing: RentalPricing;
  currencies: Currency[]; // Added this prop
}

export default function InfoPanel({ pricing, currencies }: InfoPanelProps) {
  // Find the currency by ID
  const selectedCurrency = currencies.find(c => c.id === pricing.currency) || currencies[0];
  
  return (
    <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Rental Pricing Information</h3>
          <p className="text-gray-300">
            <strong>Current Conversion:</strong> 1 Kilometer = {pricing.rentPerKm.toFixed(2)} {selectedCurrency.symbol} • 1 Mile = {pricing.rentPerMile.toFixed(2)} {selectedCurrency.symbol}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            The system automatically maintains the ratio: 1 mile rent = 1.6 × (1 km rent)
          </p>
          <div className="mt-2 text-sm">
            <span className="text-gray-400">Currency: </span>
            <span className="text-green-300">{selectedCurrency.name} ({selectedCurrency.code})</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">
            {(pricing.rentPerMile / pricing.rentPerKm).toFixed(2)}:1
          </div>
          <div className="text-sm text-gray-400">Mile:Km Ratio</div>
        </div>
      </div>
    </div>
  );
}