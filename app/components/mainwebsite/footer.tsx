import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function Footer() {
    useTheme();

    return (
        <footer className="w-full">
            {/* CTA Section - Matching Hero Theme */}
            <section className="relative py-20 bg-black overflow-hidden">
                {/* Background Effects - Matching Hero */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url('/dark-highway-background.jpg')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/95" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary),0.15),transparent_35%)]" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(var(--secondary),0.15),transparent_35%)]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-[rgb(var(--primary))]/10 mb-8">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--primary))] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"></span>
                        </span>
                        <span className="text-gray-200 font-medium text-xs tracking-[0.2em] uppercase">24-Hour Service Available</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        Call Now & Book Your
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--primary))] to-[rgb(var(--secondary))]">
                            Premium Transfer
                        </span>
                    </h2>

                    <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto font-light">
                        Experience luxury travel with our professional chauffeur service
                    </p>

                    <Link
                        href="tel:+447491321209"
                        className="inline-flex items-center gap-4 px-8 py-4 rounded-xl bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] text-white font-bold text-xl hover:opacity-90 transition-all shadow-lg shadow-[rgb(var(--primary))]/30 hover:shadow-[rgb(var(--primary))]/50 hover:scale-105 duration-300"
                    >
                        <Phone className="w-6 h-6" />
                        +44 749 132 1209
                    </Link>
                </div>
            </section>

            {/* Main Footer Section */}
            <section className="relative py-16 bg-black overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-black" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-80">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <Link href="/" className="flex items-center gap-3 group">

                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-white leading-tight group-hover:text-[rgb(var(--primary))] transition-colors">MR TRANSFERS</span>
                                    <span className="text-[10px] text-[rgb(var(--primary))] font-medium tracking-[0.15em] uppercase">Premium Service</span>
                                </div>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                No.1 UK Airport Transfer service with professional chauffeurs and luxury vehicles.
                            </p>
                        </div>

                        {/* Contact Column */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg tracking-tight">Contact</h3>
                            <div className="space-y-4">
                                <Link href="mailto:info@mrtransfers.co.uk" className="flex items-center gap-3 text-gray-400 hover:text-[rgb(var(--primary))] transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[rgb(var(--primary))]/30 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm">info@mrtransfers.co.uk</span>
                                </Link>
                                <Link href="tel:+447491321209" className="flex items-center gap-3 text-gray-400 hover:text-[rgb(var(--primary))] transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[rgb(var(--primary))]/30 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm">+44 749 132 1209</span>
                                </Link>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm">Gatwick, UK</span>
                                </div>
                            </div>
                        </div>

                        {/* Hours Column */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg tracking-tight">Working Hours</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <p>Mon – Sat: 08:00 – 18:00</p>
                                        <p className="text-gray-500">Sun: 09:00 – 18:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg tracking-tight">Quick Links</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Home", href: "/" },
                                    { label: "About Us", href: "/about" },
                                    { label: "Services", href: "/services" },
                                    { label: "Contact", href: "/contact" },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="block text-sm text-gray-400 hover:text-[rgb(var(--primary))] transition-colors hover:translate-x-1 duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Bar */}
            <section className="relative py-6 bg-black border-t border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-gray-500 text-sm">
                            © 2025 Mr Transfers. Developed by{" "}
                            <Link
                                href="https://nextleveldigitally.com"
                                className="text-[rgb(var(--primary))] hover:text-[rgb(var(--primary))]/80 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Next Level Digitally
                            </Link>
                        </div>

                        <div className="flex gap-6 text-sm text-gray-500">
                            <Link href="/privacy" className="hover:text-[rgb(var(--primary))] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-[rgb(var(--primary))] transition-colors">
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
}