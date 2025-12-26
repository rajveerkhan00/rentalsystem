'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/mainwebsite/header';
import { Footer } from '../components/mainwebsite/footer';
import ContactSection from '../components/mainwebsite/contact-section';
import { useTheme } from '../components/ThemeProvider';
import { ContactSkeleton } from '../components/mainwebsite/Skeleton';

export default function ContactPage() {
    const { isThemeLoading } = useTheme();
    const [minLoadingPassed, setMinLoadingPassed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoadingPassed(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isThemeLoading || !minLoadingPassed) {
        return <ContactSkeleton />;
    }

    return (
        <main className="bg-black">
            <Header />
            <ContactSection />
            <Footer />
        </main>
    );
}
