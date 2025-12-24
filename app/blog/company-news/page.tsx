'use client';

import { Header } from '../../components/mainwebsite/header';
import { Footer } from '../../components/mainwebsite/footer';
import { BlogContent, BlogPost } from '../../components/mainwebsite/blog-content';

const companyNewsPosts: BlogPost[] = [
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

export default function CompanyNewsPage() {
    return (
        <main className="bg-black">
            <Header />
            <BlogContent
                title="Company News"
                subtitle="The latest announcements, fleet updates, and corporate developments from Mr Transfers."
                posts={companyNewsPosts}
                activeCategory="News"
            />
            <Footer />
        </main>
    );
}
