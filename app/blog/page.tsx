'use client';

import { Header } from '../components/mainwebsite/header';
import { Footer } from '../components/mainwebsite/footer';
import { BlogContent, BlogPost } from '../components/mainwebsite/blog-content';
import { useTheme } from '../components/ThemeProvider';

const allPosts: BlogPost[] = [
    {
        id: 1,
        title: "Mr Transfers – Your Partner for Reliable Ground Travel Across Gatwick",
        description: "When it comes to Gatwick airport transfers, reliability, punctuality, and comfort are non-negotiable. At Mr Transfers, we have spent years perfecting our services...",
        image: "/blog-1.jpg",
        slug: "mr-transfers-reliable-ground-travel-gatwick",
        date: "Dec 20, 2025",
        category: "Company News",
        author: "Admin"
    },
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
        id: 3,
        title: "The Importance of Timely Transportation for Airport Transfers",
        description: "One of the most critical aspects of any air travel journey is the transfer to the airport. Being punctual can save you from unnecessary stress and missed flights.",
        image: "/blog-3.jpg",
        slug: "importance-timely-transportation-airport-transfers",
        date: "Dec 15, 2025",
        category: "General",
        author: "Expert"
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
    },
    {
        id: 5,
        title: "Expanding Our Fleet: New Mercedes-Benz V-Class Available",
        description: "We are excited to announce the addition of premium Mercedes-Benz V-Class vehicles to our Gatwick fleet, offering even more comfort for group travels.",
        image: "/blog-2.jpg",
        slug: "expanding-fleet-mercedes-benz-v-class",
        date: "Dec 05, 2025",
        category: "Company News",
        author: "Admin"
    }
];

export default function BlogPage() {
    useTheme();
    return (
        <main className="bg-black">
            <Header />
            <BlogContent
                title="All Articles"
                subtitle="Stay updated with the latest news, travel guides, and insights from the team at Mr Transfers."
                posts={allPosts}
                activeCategory="All"
            />
            <Footer />
        </main>
    );
}
