'use client';

import { Header } from '../components/mainwebsite/header';
import { Footer } from '../components/mainwebsite/footer';
import ContactSection from '../components/mainwebsite/contact-section';
import { useTheme } from '../components/ThemeProvider';

export default function ContactPage() {
    useTheme();
    return (
        <main className="bg-black">
            <Header />
            <ContactSection />
            <Footer />
        </main>
    );
}
