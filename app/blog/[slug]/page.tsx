
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '../../components/mainwebsite/header';
import { Footer } from '../../components/mainwebsite/footer';
import { useTheme } from '../../components/ThemeProvider';
import { Loader2, Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cleanDomain, fetchDomainPricing } from '@/lib/db.utils';

export default function BlogPostPage() {
    const { slug } = useParams();
    const { isThemeLoading } = useTheme();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [domainData, setDomainData] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            if (typeof window === 'undefined' || !slug) return;
            try {
                const currentDomain = window.location.hostname;
                const cleanedDomain = cleanDomain(currentDomain);

                // Fetch domain data (for header/footer)
                const dData = await fetchDomainPricing(cleanedDomain);
                setDomainData(dData);

                // Fetch blog post
                const res = await fetch(`/api/blogs/slug/${slug}?domain=${cleanedDomain}`);
                if (res.ok) {
                    const data = await res.json();
                    setBlog(data);
                } else {
                    console.error('Blog post not found');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [slug]);

    if (isThemeLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[rgb(var(--primary))] animate-spin" />
            </div>
        );
    }

    if (!blog) {
        return (
            <main className="bg-black min-h-screen flex flex-col">
                <Header domainData={domainData} />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-white/70 mb-6">Article Not Found</h2>
                    <Link
                        href="/blog"
                        className="px-6 py-3 bg-[rgb(var(--primary))] text-white rounded-xl hover:opacity-90 transition-all font-medium flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
                <Footer domainData={domainData} />
            </main>
        );
    }

    return (
        <main className="bg-black min-h-screen flex flex-col">
            <Header domainData={domainData} />

            <article className="relative pt-32 pb-24 flex-grow">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[rgb(var(--primary))]/10 to-transparent opacity-30" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
                    {/* Back Link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-[rgb(var(--primary))] transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to All Articles
                    </Link>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-[rgb(var(--primary))]"></span>
                            General
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {blog.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {blog.author}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Featured Image */}
                    {blog.image && (
                        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 border border-white/10 shadow-2xl shadow-[rgb(var(--primary))]/10">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                onError={(e: any) => {
                                    e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* 
                           For security, be careful with dangerouslySetInnerHTML. 
                           Ideally use a markdown parser if content is markdown.
                           Assuming simple text or trusted HTML for now as per "admin" input.
                           But since the input was a textarea, it's likely plain text or simple markdown.
                           Let's basically render it as paragraphs for now if it's plain text.
                        */}
                        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-light">
                            {blog.content}
                        </div>
                    </div>
                </div>
            </article>

            <Footer domainData={domainData} />
        </main>
    );
}
