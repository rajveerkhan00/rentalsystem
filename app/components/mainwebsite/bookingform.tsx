"use client";

import { useState } from "react";
import { Search, Calendar, Clock, MapPin, ChevronDown } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function BookingForm() {
  useTheme();
  const [returnJourney, setReturnJourney] = useState(false);

  return (
    <div className="space-y-5">
      {/* Pick up Location */}
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <MapPin className="w-4 h-4" />
          Pick-up Location
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Airport, address, or postcode"
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-gray-500/30 text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent group-hover:border-[rgb(var(--primary))]/50 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[rgb(var(--primary))] transition-colors" />
        </div>
      </div>

      {/* Drop off Location */}
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <MapPin className="w-4 h-4" />
          Drop-off Location
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Airport, address, or postcode"
            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-gray-500/30 text-white placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent group-hover:border-[rgb(var(--primary))]/50 transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[rgb(var(--primary))] transition-colors" />
        </div>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Date */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <div className="relative">
            <input
              type="text"
              defaultValue="Today"
              className="w-full pl-4 pr-10 py-4 bg-white/10 border border-gray-500/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent group-hover:border-[rgb(var(--primary))]/50 transition-all"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[rgb(var(--primary))] transition-colors" />
          </div>
        </div>

        {/* Time */}
        <div className="group col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Clock className="w-4 h-4" />
            Time
          </label>
          <div className="flex gap-2">
            {/* Hour */}
            <select className="flex-1 px-4 py-4 bg-white/10 border border-gray-500/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent group-hover:border-[rgb(var(--primary))]/50 transition-all appearance-none cursor-pointer">
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i} className="bg-gray-900">
                  {i.toString().padStart(2, "0")}
                </option>
              ))}
            </select>

            {/* Minute */}
            <select className="flex-1 px-4 py-4 bg-white/10 border border-gray-500/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent group-hover:border-[rgb(var(--primary))]/50 transition-all appearance-none cursor-pointer">
              {["00", "15", "30", "45"].map((min) => (
                <option key={min} value={min} className="bg-gray-900">
                  {min}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Return Journey */}
      <div className="bg-white/5 border border-gray-500/20 rounded-xl p-4 transition-all hover:border-[rgb(var(--primary))]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                id="return"
                checked={returnJourney}
                onChange={(e) => setReturnJourney(e.target.checked)}
                className="sr-only"
              />
              <label
                htmlFor="return"
                className={`flex items-center justify-center w-6 h-6 rounded border-2 cursor-pointer transition-all ${returnJourney ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))]' : 'border-gray-400'}`}
              >
                {returnJourney && (
                  <span className="text-white text-sm">✓</span>
                )}
              </label>
            </div>
            <label htmlFor="return" className="text-white font-medium cursor-pointer">
              Return journey
            </label>
          </div>
          <span className="text-sm text-gray-400">Add return trip</span>
        </div>

        {returnJourney && (
          <div className="mt-4 pt-4 border-t border-gray-500/20 space-y-3 animate-slideDown">
            <label className="block text-sm font-medium text-gray-300">Return Date & Time</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <input
                  type="text"
                  defaultValue="Tomorrow"
                  className="w-full pl-4 pr-10 py-3 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <select className="px-3 py-3 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]">
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i} className="bg-gray-900">
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              <select className="px-3 py-3 bg-white/10 border border-gray-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]">
                {["00", "15", "30", "45"].map((min) => (
                  <option key={min} value={min} className="bg-gray-900">
                    {min}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        className="w-full py-4 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white font-bold text-lg rounded-xl hover:opacity-90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-[rgb(var(--primary))]/25"
      >
        Get Instant Quote
      </button>
    </div>
  );
}