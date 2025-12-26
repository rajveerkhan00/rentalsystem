'use client';

import React from 'react';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`relative overflow-hidden bg-white/5 rounded-2xl ${className}`}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="space-y-10 max-w-2xl">
                        <Skeleton className="h-10 w-48 rounded-full" />
                        <div className="space-y-6">
                            <Skeleton className="h-20 w-3/4" />
                            <Skeleton className="h-20 w-1/2" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-px w-12" />
                                <Skeleton className="h-8 w-64" />
                            </div>
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <div className="grid grid-cols-3 gap-5 pt-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:ml-auto w-full max-w-[480px]">
                        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-6 space-y-6">
                            <div className="flex justify-between items-center pb-6 border-b border-white/5">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-lg" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                                <Skeleton className="h-14 w-full rounded-xl mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SectionSkeleton({ cardCount = 3 }: { cardCount?: number }) {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-full mx-auto" />
                </div>
                <div className={`grid md:grid-cols-${Math.min(cardCount, 3)} lg:grid-cols-${cardCount} gap-8`}>
                    {Array.from({ length: cardCount }).map((_, i) => (
                        <Skeleton key={i} className="h-80 w-full" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BlogCardSkeleton() {
    return (
        <div className="bg-[#0A0A0A]/80 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col">
            <Skeleton className="h-64 w-full rounded-none" />
            <div className="p-8 space-y-4 flex-grow">
                <div className="flex gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-24 rounded-full mt-4" />
            </div>
        </div>
    );
}

export function ContactSkeleton() {
    return (
        <section className="py-24 bg-black pt-32">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-16 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#0A0A0A]/80 border border-white/10 rounded-2xl p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function AboutSkeleton() {
    return (
        <section className="py-24 bg-black overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <Skeleton className="h-[600px] w-full rounded-3xl" />
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48 rounded-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-24 w-3/4" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-32 w-full rounded-2xl" />
                            <Skeleton className="h-32 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ServicesSkeleton() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ExperienceSkeleton() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-16 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-2 gap-6">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
            </div>
        </section>
    );
}

export function WhyChooseUsSkeleton() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-16 w-3/4" />
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                    <Skeleton className="h-[500px] w-full rounded-2xl" />
                </div>
            </div>
        </section>
    );
}

export function TestimonialsSkeleton() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <Skeleton className="h-4 w-32 mx-auto rounded-full" />
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BlogSectionSkeleton() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-12 w-1/2" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <BlogCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function FooterSkeleton() {

    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-6">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Skeleton className="h-4 w-64" />
                    <div className="flex gap-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-black">
            <HeroSkeleton />
            <SectionSkeleton cardCount={3} />
            <SectionSkeleton cardCount={4} />
            <WhyChooseUsSkeleton />
            <TestimonialsSkeleton />
            <FooterSkeleton />
        </div>
    );
}

export function BlogSkeleton() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
                    <Skeleton className="h-10 w-48 mx-auto rounded-full" />
                    <Skeleton className="h-16 w-3/4 mx-auto" />
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1700px] mx-auto">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <BlogCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
