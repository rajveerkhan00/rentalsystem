'use client';

import { Header } from '../components/mainwebsite/header';
import { Footer } from '../components/mainwebsite/footer';
import ContactSection from '../components/mainwebsite/contact-section';

export default function ContactPage() {
    return (
        <main className="bg-white">
            <Header />
            <ContactSection />
            <Footer />
        </main>
    );
}
