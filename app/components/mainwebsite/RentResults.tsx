'use client';

import {
    AlertTriangle,
    Info,
    MapPin,
    Clock,
    X
} from 'lucide-react';
import { getCurrencySymbolById } from '@/lib/db.utils';

interface RentResultsProps {
    distance: number | null;
    rent: number | null;
    hasTraffic: boolean;
    routeInstructions: Array<{
        instruction: string;
        distance: number;
    }>;
    formData: {
        unit: 'km' | 'mile';
    };
    domainData: any;
    onClose?: () => void;
}

export default function RentResults({
    distance,
    rent,
    hasTraffic,
    routeInstructions,
    formData,
    domainData,
    onClose
}: RentResultsProps) {
    if (distance === null && rent === null) return null;

    return (
        <div className="w-full mt-12 animate-fade-in-up">
            {/* Main Stats Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:bg-white/15 transition-all duration-500">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                    {/* Price Section */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-[rgb(var(--primary))] text-sm opacity-80 font-medium mb-1">Estimated Price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-white tracking-tight">
                                {getCurrencySymbolById(domainData?.pricing?.currency ?? 0)}{rent?.toFixed(2)}
                            </span>
                            {hasTraffic && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">
                                    <AlertTriangle className="w-3 h-3" />
                                    HIGH TRAFFIC
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Includes all taxes and fees
                        </p>
                    </div>

                    {/* Distance Section */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-5 h-5 text-[rgb(var(--primary))]" />
                            <p className="text-gray-300 font-medium">Total Distance</p>
                        </div>
                        <p className="text-3xl font-bold text-white pl-7">
                            {distance?.toFixed(1)} <span className="text-lg font-normal text-gray-400">{formData.unit}</span>
                        </p>
                        {routeInstructions.length > 0 && (
                            <p className="text-xs text-gray-400 pl-7 mt-1">
                                Via fastest route
                            </p>
                        )}
                    </div>

                    {/* Instructions Preview / Info */}
                    <div className="md:border-l md:border-white/10 md:pl-8">
                        {hasTraffic ? (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-200">Traffic Alert</p>
                                        <p className="text-xs text-amber-200/80 leading-relaxed mt-1">
                                            Heavy traffic detected. Price adjusted +2%.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-green-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-green-200">Standard Rate</p>
                                        <p className="text-xs text-green-200/80 leading-relaxed mt-1">
                                            Normal traffic conditions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Route Instructions Strip */}
            {routeInstructions.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {routeInstructions.slice(0, 5).map((inst, index) => (
                        <div key={index} className="flex-none w-64 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-black/60 transition-colors">
                            <div className="flex items-start gap-3">
                                <span className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] text-xs font-bold border border-[rgb(var(--primary))]/30">
                                    {index + 1}
                                </span>
                                <div>
                                    <p className="text-sm text-gray-200 line-clamp-2" title={inst.instruction}>
                                        {inst.instruction}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {(inst.distance / 1000).toFixed(2)} km
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
