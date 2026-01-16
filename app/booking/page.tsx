'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/mainwebsite/header';
import { Footer } from '../components/mainwebsite/footer';
import { useTheme } from '../components/ThemeProvider';
import { PageSkeleton } from '../components/mainwebsite/Skeleton';
import {
    fetchDomainPricing,
    cleanDomain
} from '@/lib/db.utils';

export default function BookingPage() {
    const { isThemeLoading } = useTheme();
    const [domainData, setDomainData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [minLoadingPassed, setMinLoadingPassed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [prefilledData, setPrefilledData] = useState<string>('');

    useEffect(() => {
        if (domainData) {
            document.title = `Book Now | ${domainData.siteContent?.websiteName || 'Mr Transfers'}`;

            // Update meta description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', `Book your premium transfer with ${domainData.siteContent?.websiteName || 'Mr Transfers'}. Instant quotes and professional service.`);
        }
    }, [domainData]);

    const domainName = domainData?.domain?.domainName || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');

    useEffect(() => {
        // Start minimum loading timer
        const timer = setTimeout(() => {
            setMinLoadingPassed(true);
        }, 1000);

        const initializeData = async () => {
            const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
            setIsLoading(true);
            try {
                const cleanedCurrentDomain = cleanDomain(currentDomain);
                const data = await fetchDomainPricing(cleanedCurrentDomain);
                if (data) {
                    setDomainData(data);
                }
            } catch (err) {
                console.error('Error loading domain data:', err);
                setError('Failed to load domain pricing information');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Check for prefilled form data from hero section
        const savedData = sessionStorage.getItem('bookingFormData');
        console.log('📦 Checking sessionStorage for bookingFormData:', savedData);

        if (savedData) {
            const encoded = encodeURIComponent(savedData);
            console.log('✅ Form data found! Encoded:', encoded);
            setPrefilledData(encoded);
            // Clear the data after retrieving it
            sessionStorage.removeItem('bookingFormData');
        } else {
            console.log('❌ No form data found in sessionStorage');
        }
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Only accept messages from your deployed Vercel domain
            if (event.origin !== 'https://booking-system-rouge-phi.vercel.app') return;

            if (event.data && event.data.type === 'resize') {
                const iframe = document.getElementById('booking-iframe') as HTMLIFrameElement;
                if (iframe) {
                    iframe.style.height = (event.data.height) + 'px';
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        if (prefilledData) {
            const iframeUrl = `https://booking-system-rouge-phi.vercel.app/embed?domain=${domainName}&hide-bg=true&hide-header=true&formData=${prefilledData}`;
            console.log('🎯 Iframe URL with formData:', iframeUrl);
            console.log('📏 FormData length:', prefilledData.length);
        }
    }, [prefilledData, domainName]);

    if ((isLoading || isThemeLoading || !minLoadingPassed) && !domainData) {
        return <PageSkeleton />;
    }

    return (
        <main className="min-h-screen bg-black">
            <Header domainData={domainData} />

            {/* Spacer for fixed header */}
            <div className="h-24 md:h-32"></div>

            <section className="relative px-4">
                <div className="container mx-auto max-w-7xl">
                    {/* Page Heading */}
                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]">Transfer</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Complete the form below to book your premium chauffeur service. Instant confirmation and best price guaranteed.
                        </p>
                    </div>

                    {/* Iframe Container */}
                    <div className="relative group">
                        {/* Glow Background */}

                        {/* Glass Card */}
                        <div className="relative w-full overflow-hidden" style={{ lineHeight: 0 }}>
                            <iframe
                                id="booking-iframe"
                                src={`https://booking-system-rouge-phi.vercel.app/embed?domain=${domainName}${prefilledData ? `&formData=${prefilledData}` : ''}`}
                                width="100%"
                                height="800"
                                className="w-full border-none block"
                                style={{
                                    minHeight: '420px',
                                    background: 'black',
                                    border: 0,
                                    margin: 0,
                                    padding: 0,
                                    display: 'block'
                                }}
                                scrolling="no"
                                frameBorder="0"
                                title="Booking Form"
                            ></iframe>
                        </div>
                    </div>

                    {/* Trust Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center mb-4 text-[rgb(var(--primary))]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="text-white font-bold mb-2">Secure Payment</h3>
                            <p className="text-sm text-gray-400">All transactions are encrypted and processed through secure payment gateways.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 rounded-full bg-[rgb(var(--secondary))]/20 flex items-center justify-center mb-4 text-[rgb(var(--secondary))]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-white font-bold mb-2">24/7 Support</h3>
                            <p className="text-sm text-gray-400">Our team is available round the clock to assist you with your booking needs.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </div>
                            <h3 className="text-white font-bold mb-2">Free Cancellation</h3>
                            <p className="text-sm text-gray-400">Enjoy peace of mind with our flexible cancellation policy on all bookings.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer domainData={domainData} />
        </main>
    );
}

