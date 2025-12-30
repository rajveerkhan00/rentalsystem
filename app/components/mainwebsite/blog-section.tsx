import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useTheme } from "../ThemeProvider"
import { BlogSectionSkeleton } from "./Skeleton"

interface BlogPost {
  id: number
  title: string
  description: string
  image: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mr Transfers – Your Partner for Reliable Ground Travel Across Gatwick",
    description:
      "Why Choose Mr Transfers for Your Gatwick Airport Transfers? When it comes to Gatwick airport transfers, reliability, punctuality...",
    image: "/blog-1.jpg",
    slug: "mr-transfers-reliable-ground-travel-gatwick",
  },
  {
    id: 2,
    title: "Your Trusted Partner for Booking a Taxi to Gatwick Airport – Mr Transfers",
    description:
      "Traveling to or from Gatwick Airport should be simple, stress-free, and comfortable. At Mr Transfers, we specialize in...",
    image: "/blog-2.jpg",
    slug: "booking-taxi-gatwick-airport-mr-transfers",
  },
  {
    id: 3,
    title: "The Importance of Timely Transportation for Airport Transfers",
    description:
      "Traveling can be stressful, especially when you're racing against the clock to catch a flight. One of the...",
    image: "/blog-3.jpg",
    slug: "importance-timely-transportation-airport-transfers",
  },
]

export function BlogSection({ loading }: { loading?: boolean }) {
  if (loading) return <BlogSectionSkeleton />;
  useTheme();

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects - Matching Hero */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/blogbg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(var(--primary),0.1),transparent_40%)]" />
        <div className="hidden md:block absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(var(--secondary),0.1),transparent_40%)]" />
        <div className="hidden md:block absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div className="space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-[rgb(var(--primary))]/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--primary))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"></span>
              </span>
              <span className="text-gray-200 font-medium text-xs tracking-[0.2em] uppercase">Our News</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--primary))] to-[rgb(var(--secondary))]">Articles</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl font-light">
              Stay updated with the latest news and insights about premium travel
            </p>
          </div>

          <Link
            href="/blog"
            className="mt-8 md:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white font-medium hover:bg-white/10 hover:border-[rgb(var(--primary))]/30 transition-all group"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[rgb(var(--primary))]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[rgb(var(--primary))]/10"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

                {/* Badge */}
                <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                  Blog
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[rgb(var(--primary))] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-[rgb(var(--primary))] text-sm font-medium pt-2">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--primary))]/5 to-[rgb(var(--secondary))]/5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
