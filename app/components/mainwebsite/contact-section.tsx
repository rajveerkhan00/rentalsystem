import { MapPin, Phone, Mail, Facebook, Linkedin } from "lucide-react"
import Link from "next/link"

export default function ContactSection() {
    return (
        <section className="relative min-h-screen bg-black overflow-hidden">
            {/* Background Effects - Hero Style */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-105 animate-subtle-zoom"
                    style={{ backgroundImage: `url('/blogbg.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.15),transparent_40%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_40%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Breadcrumb / Hero Header */}
            <div className="relative pt-24 pb-12 overflow-hidden mt-20">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8vw] font-bold text-white/[0.02] select-none pointer-events-none tracking-tighter italic whitespace-nowrap">
                        GET IN TOUCH
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
                        <span className="w-1 h-1 rounded-full bg-pink-500 animate-pulse"></span>
                        <span className="text-[20px] text-gray-300 font-bold tracking-widest uppercase">Contact Us</span>
                    </div>
                    <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Reach Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 animate-gradient-x">Support Team</span>
                    </h1>
                    <nav className="flex items-center justify-center gap-3 text-sm font-medium">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                        <span className="text-pink-500/50">/</span>
                        <span className="text-white">Contact</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Left Column - Contact Info */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none">
                                We're Here to <br />
                                <span className="text-pink-500">Help You 24/7.</span>
                            </h2>
                            <p className="text-gray-400 text-base leading-relaxed font-light max-w-xl">
                                Whether you have questions about a booking, need a custom quote, or want to discuss corporate travel,
                                our specialized support team is ready to assist.
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="grid gap-6">
                            {[
                                {
                                    icon: MapPin,
                                    label: "Location",
                                    value: "London Gatwick, UK",
                                    color: "from-pink-500 to-rose-500"
                                },
                                {
                                    icon: Phone,
                                    label: "Phone",
                                    value: "+44 7491 321 209",
                                    href: "tel:+447491321209",
                                    color: "from-purple-500 to-indigo-500"
                                },
                                {
                                    icon: Mail,
                                    label: "Email",
                                    value: "info@mrtransfers.co.uk",
                                    href: "mailto:info@mrtransfers.co.uk",
                                    color: "from-pink-500 to-purple-500"
                                }
                            ].map((item, i) => (
                                <div key={i} className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-x-1">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform duration-500`}>
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mb-1">{item.label}</p>
                                        {item.href ? (
                                            <a href={item.href} className="text-lg font-bold text-white hover:text-pink-400 transition-colors tracking-tight">
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-lg font-bold text-white tracking-tight">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Follow Us</span>
                            <div className="flex gap-4">
                                {[Facebook, Linkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-500 transition-all duration-300">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="relative group">
                        {/* Glow Behind Form */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                        <div className="relative bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">Send a Message</h3>
                                <p className="text-gray-400 font-light">We'll get back to you in less than 2 hours.</p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-gray-600 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-gray-600 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="How can we help?"
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-gray-600 text-sm"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us more about your request..."
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-gray-600 resize-none text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 flex items-center justify-center gap-2 group/btn"
                                >
                                    <span>Send Message</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
