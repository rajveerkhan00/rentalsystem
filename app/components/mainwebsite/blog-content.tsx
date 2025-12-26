import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, User, Tag } from "lucide-react"
import { useTheme } from "../ThemeProvider";

export interface BlogPost {
    id: number
    title: string
    description: string
    image: string
    slug: string
    date: string
    category: string
    author: string
}

interface BlogContentProps {
    title: string
    subtitle: string
    posts: BlogPost[]
    activeCategory?: string
}

export function BlogContent({ title, subtitle, posts, activeCategory = "All" }: BlogContentProps) {
    useTheme();

    return (
        <section className="relative min-h-screen bg-black overflow-hidden pt-32 pb-24">
            {/* Background Effects - Matching Hero */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-105 animate-subtle-zoom"
                    style={{ backgroundImage: `url('/blogbg.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(var(--secondary),0.15),transparent_40%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(var(--primary),0.1),transparent_40%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter italic whitespace-nowrap uppercase">
                        {activeCategory}
                    </div>

                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-[rgb(var(--primary))]/10 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--primary))] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"></span>
                        </span>
                        <span className="text-gray-200 font-medium text-xs tracking-[0.2em] uppercase">{title}</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))] animate-gradient-x">Latest Insights</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-light leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1700px] mx-auto">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[rgb(var(--primary))]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[rgb(var(--primary))]/10 flex flex-col"
                        >
                            <Link href={`/blog/${post.slug}`} className="cursor-pointer block flex-grow">
                                {/* Image Container */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={post.image || "/blogbg.jpg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />

                                    {/* Category Badge */}
                                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                        {post.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 space-y-4">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[rgb(var(--primary))]" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-[rgb(var(--primary))]" />
                                            {post.author}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-[rgb(var(--primary))] transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-light line-clamp-3">
                                        {post.description}
                                    </p>

                                    {/* Read More */}
                                    <div className="flex items-center gap-2 text-[rgb(var(--primary))] text-sm font-bold pt-4 group-hover:gap-4 transition-all duration-300">
                                        <span className="uppercase tracking-widest">Read Article</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>

                            {/* Decorative Glow */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
