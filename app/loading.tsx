import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl">
            <div className="relative flex flex-col items-center gap-4">
                {/* Animated Rings */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[rgb(var(--primary))] animate-spin"></div>
                    <div className="absolute inset-1 rounded-full border-r-2 border-b-2 border-[rgb(var(--secondary))] animate-spin-reverse"></div>
                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[rgb(var(--accent))] animate-pulse"></div>

                    {/* Center Dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-1 text-center">
                    <p className="text-sm font-medium text-white tracking-[0.2em] uppercase animate-pulse">
                        Loading
                    </p>
                </div>
            </div>
        </div>
    );
}
