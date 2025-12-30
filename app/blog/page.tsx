'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/mainwebsite/header';
import { Footer } from '../components/mainwebsite/footer';
import { BlogContent, BlogPost } from '../components/mainwebsite/blog-content';
import { useTheme } from '../components/ThemeProvider';
import { BlogSkeleton } from '../components/mainwebsite/Skeleton';
import { cleanDomain, fetchDomainPricing } from '@/lib/db.utils';

export default function BlogPage() {
    const { isThemeLoading } = useTheme();
    const [minLoadingPassed, setMinLoadingPassed] = useState(false);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [domainData, setDomainData] = useState<any>(null);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoadingPassed(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (typeof window === 'undefined') return;
            try {
                const currentDomain = window.location.hostname;
                const cleanedDomain = cleanDomain(currentDomain);

                // Fetch domain data
                const dData = await fetchDomainPricing(cleanedDomain);
                setDomainData(dData);

                // Fetch blogs
                const res = await fetch(`/api/blogs?domain=${cleanedDomain}`);
                if (res.ok) {
                    const data = await res.json();
                    const mappedBlogs = data.map((b: any) => ({
                        id: b._id,
                        title: b.title,
                        description: b.excerpt,
                        image: b.image,
                        slug: b.slug,
                        date: b.date,
                        category: "General",
                        author: b.author
                    }));
                    setBlogs(mappedBlogs);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingBlogs(false);
            }
        };
        loadData();
    }, []);

    if (isThemeLoading || !minLoadingPassed || loadingBlogs) {
        return <BlogSkeleton />;
    }

    return (
        <main className="bg-black">
            <Header domainData={domainData} />
            {blogs.length > 0 ? (
                <BlogContent
                    title="All Articles"
                    subtitle="Stay updated with the latest news, travel guides, and insights."
                    posts={blogs}
                    activeCategory="All"
                />
            ) : (
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-32">
                    <h2 className="text-3xl font-bold text-white/50 mb-4">No Articles Found</h2>
                    <p className="text-gray-500 max-w-md">There are currently no articles available for this domain. Please check back later.</p>
                </div>
            )}
            <Footer domainData={domainData} />
        </main>
    );
}
