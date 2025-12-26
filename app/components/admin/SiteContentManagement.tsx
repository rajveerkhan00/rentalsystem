'use client';
import { ChangeEvent } from 'react';
import { DomainData, SiteContent } from './types';

interface SiteContentManagementProps {
    siteContent: SiteContent;
    domains: DomainData[];
    selectedDomainIndex: number;
    onDomainSelect: (index: number) => void;
    onContentChange: (field: keyof SiteContent, value: string) => void;
}

export default function SiteContentManagement({
    siteContent,
    domains,
    selectedDomainIndex,
    onDomainSelect,
    onContentChange
}: SiteContentManagementProps) {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onContentChange(name as keyof SiteContent, value);
    };

    return (
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10 ring-1 ring-white/5 relative overflow-hidden group/card transition-all duration-300">
            {/* Accent Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[rgb(var(--secondary))]/10 rounded-full blur-3xl group-hover/card:bg-[rgb(var(--secondary))]/20 transition-all duration-500" />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-[rgb(var(--secondary))]/20 rounded-lg text-[rgb(var(--secondary))]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    Site Content
                </h2>

                {domains && domains.length > 0 && (
                    <div className="relative">
                        <select
                            value={selectedDomainIndex}
                            onChange={(e) => onDomainSelect(parseInt(e.target.value))}
                            className="appearance-none bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-gray-300 focus:outline-none focus:ring-1 focus:ring-[rgb(var(--primary))]/50 cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <option value={-1}>Global Default</option>
                            {domains.map((domain, index) => (
                                <option key={index} value={index}>
                                    {domain.domainName} {domain.siteContent ? '(Custom)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6 relative z-10">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Main Website Name
                        </label>
                        <input
                            type="text"
                            name="websiteName"
                            value={siteContent?.websiteName || ''}
                            onChange={handleInputChange}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-medium"
                            placeholder="e.g. Mr Transfers"
                        />
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Hero Section Title
                        </label>
                        <input
                            type="text"
                            name="heroTitle"
                            value={siteContent?.heroTitle || ''}
                            onChange={handleInputChange}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-medium"
                            placeholder="e.g. Ride with"
                        />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Hero Subtitle
                    </label>
                    <input
                        type="text"
                        name="heroSubtitle"
                        value={siteContent?.heroSubtitle || ''}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-medium"
                        placeholder="e.g. No.1 UK Airport Transfers"
                    />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            name="contactEmail"
                            value={siteContent?.contactEmail || ''}
                            onChange={handleInputChange}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-medium"
                            placeholder="info@example.com"
                        />
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Contact Phone
                        </label>
                        <input
                            type="text"
                            name="contactPhone"
                            value={siteContent?.contactPhone || ''}
                            onChange={handleInputChange}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-medium"
                            placeholder="+44 123 456 789"
                        />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 group/input transition-all duration-300 hover:border-white/20">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                        Working Hours
                    </label>
                    <input
                        type="text"
                        name="workingHours"
                        value={siteContent?.workingHours || ''}
                        onChange={handleInputChange}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/30 transition-all font-medium"
                        placeholder="Mon – Sat: 08:00 – 18:00"
                    />
                </div>

            </div>
        </div>
    );
}
