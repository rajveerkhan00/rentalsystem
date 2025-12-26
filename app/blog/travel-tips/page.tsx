'use client';

import { Header } from '../../components/mainwebsite/header';
import { Footer } from '../../components/mainwebsite/footer';
import { BlogContent, BlogPost } from '../../components/mainwebsite/blog-content';
import { useTheme } from '../../components/ThemeProvider';

const travelTipsPosts: BlogPost[] = [
    {
        id: 2,
        title: "Your Trusted Partner for Booking a Taxi to Gatwick Airport",
        description: "Traveling to or from Gatwick Airport should be simple, stress-free, and comfortable. Our specialized fleet ensures you arrive refreshed and on time.",
        image: "/blog-2.jpg",
        slug: "booking-taxi-gatwick-airport-mr-transfers",
        date: "Dec 18, 2025",
        category: "Travel Tips",
        author: "Team"
    },
    {
        id: 4,
        title: "Top 5 Tips for a Smooth Gatwick Connection",
        description: "Navigating Gatwick can be tricky if you're not prepared. From choosing the right terminal to booking your transfer in advance, here's what you need to know.",
        image: "/blog-1.jpg",
        slug: "top-5-tips-smooth-gatwick-connection",
        date: "Dec 10, 2025",
        category: "Travel Tips",
        author: "Guide"
    }
];

export default function TravelTipsPage() {
    useTheme();
    return (
        <main className="bg-black">
            <Header />
            <BlogContent
                title="Travel Tips"
                subtitle="Expert advice and handy guides to make your Gatwick travel experience as smooth as possible."
                posts={travelTipsPosts}
                activeCategory="Tips"
            />
            <Footer />
        </main>
    );
}
