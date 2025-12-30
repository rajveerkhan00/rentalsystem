import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative flex flex-col items-center gap-4">
                {/* Simple Spinner */}
                <div className="w-12 h-12 border-2 border-white/20 border-t-[rgb(var(--primary))] rounded-full animate-spin"></div>
            </div>
        </div>
    );
}
