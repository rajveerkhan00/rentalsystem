"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Mail, Phone, Calendar, ChevronDown, Menu, X, ArrowRight, LayoutDashboard, User } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function Header(props: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [airportOpen, setAirportOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const { data: session } = useSession();
  useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed  top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 pointer-events-none">
      <div
        className={`
          pointer-events-auto
          transition-all duration-500 ease-in-out
          ${scrolled ? 'w-full max-w-5xl py-3 px-6 bg-[#0A0A0A]/95 border border-white/10 shadow-2xl rounded-full' : 'container mx-auto py-4 px-4 sm:px-6 lg:px-8 bg-transparent border-transparent'}
          flex items-center justify-between
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative transform transition-transform group-hover:scale-110">
            <svg viewBox="0 0 60 60" className="w-10 h-10 md:w-12 md:h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="28" className="fill-[rgb(var(--primary))] group-hover:opacity-90 transition-opacity" />
              <path
                d="M15 35h30v5c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1h-14v1c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-5z"
                fill="currentColor"
                className="text-white"
              />
              <path
                d="M18 35l2-8h20l2 8M20 38h4M36 38h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-white"
              />
              <path
                d="M12 25h4v-8h-4v8zM18 25h3v-5h-3v5zM23 25h3v-10h-3v10zM28 25h3v-7h-3v7zM33 25h4v-9h-4v9zM39 25h3v-6h-3v6zM44 25h4v-8h-4v8z"
                fill="currentColor"
                className="text-white/60"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-black text-white leading-none tracking-tight uppercase">
              {props.domainData?.siteContent?.websiteName || 'MR TRANSFERS'}
            </span>
            <span className="text-[10px] md:text-xs text-[rgb(var(--primary))] font-bold tracking-widest leading-none mt-0.5">PREMIUM TRAVEL</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-white hover:text-[rgb(var(--primary))] transition-colors rounded-full hover:bg-white/5"
          >
            Home
          </Link>

          {/* Airport Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setAirportOpen(true)}
            onMouseLeave={() => setAirportOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white hover:text-[rgb(var(--primary))] transition-colors rounded-full hover:bg-white/5 outline-none">
              Airports
              <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl py-2 transition-all duration-300 transform origin-top ${airportOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
              {/* Triangle Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1.5 w-3 h-3 bg-black/90 border-t border-l border-white/10 rotate-45"></div>

              <Link href="/airport/heathrow" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors group/item">
                Heathrow <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[rgb(var(--primary))]" />
              </Link>
              <Link href="/airport/gatwick" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors group/item">
                Gatwick <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[rgb(var(--primary))]" />
              </Link>
              <Link href="/airport/stansted" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors group/item">
                Stansted <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[rgb(var(--primary))]" />
              </Link>
              <Link href="/airport/luton" className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors group/item">
                Luton <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-[rgb(var(--primary))]" />
              </Link>
            </div>
          </div>

          <Link
            href="/areas"
            className="px-4 py-2 text-sm font-medium text-white hover:text-[rgb(var(--primary))] transition-colors rounded-full hover:bg-white/5"
          >
            Areas
          </Link>

          {/* Blog Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white hover:text-[rgb(var(--primary))] transition-colors rounded-full hover:bg-white/5 outline-none">
              Blog
              <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl py-2 transition-all duration-300 transform origin-top ${blogOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1.5 w-3 h-3 bg-black/90 border-t border-l border-white/10 rotate-45"></div>
              <Link href="/blog" className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors">All Posts</Link>
              <Link href="/blog/travel-tips" className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors">Travel Tips</Link>
              <Link href="/blog/company-news" className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 mx-1 rounded-lg transition-colors">Company News</Link>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 text-sm font-medium text-white hover:text-[rgb(var(--primary))] transition-colors rounded-full hover:bg-white/5"
          >
            Contact
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href={session ? "/AdminDashboard" : "/AdminLogin"}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium group px-3 py-1.5 rounded-full hover:bg-white/5 border border-white/5 hover:border-white/10"
          >
            {session ? (
              <>
                <LayoutDashboard className="w-4 h-4 text-[rgb(var(--primary))]" />
                <span>Dashboard</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[rgb(var(--primary))]" />
                <span>Admin</span>
              </>
            )}
          </Link>
          <Link
            href={`tel:${props.domainData?.siteContent?.contactPhone || '+44123456789'}`}
            className="hidden xl:flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[rgb(var(--primary))]/20 group-hover:text-[rgb(var(--primary))] transition-all border border-white/10">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span>{props.domainData?.siteContent?.contactPhone || '+44 123 456 789'}</span>
          </Link>
          <Link href="/booking">
            <button className="bg-white text-black hover:bg-[rgb(var(--primary))] hover:text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transform hover:-translate-y-0.5 text-sm flex items-center gap-2">
              Book Now <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-white hover:text-[rgb(var(--primary))] transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none delay-500'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 w-80 h-full bg-gray-950 border-l border-white/10 shadow-2xl p-6 transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-white">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-6">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-white hover:text-[rgb(var(--primary))]">Home</Link>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Airports</p>
              <div className="space-y-3 pl-2 border-l border-white/10 ml-1">
                {['Heathrow', 'Gatwick', 'Stansted', 'Luton'].map(airport => (
                  <Link
                    key={airport}
                    href={`/airport/${airport.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white text-sm"
                  >
                    {airport}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/areas" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-white hover:text-[rgb(var(--primary))]">Areas We Cover</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-white hover:text-[rgb(var(--primary))]">Blog</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium text-white hover:text-[rgb(var(--primary))]">Contact</Link>
            <Link
              href={session ? "/AdminDashboard" : "/AdminLogin"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-lg font-medium text-white hover:text-[rgb(var(--primary))]"
            >
              {session ? <LayoutDashboard className="w-5 h-5 text-[rgb(var(--primary))]" /> : <User className="w-5 h-5 text-[rgb(var(--primary))]" />}
              {session ? "Dashboard" : "Admin Login"}
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
            <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-[rgb(var(--primary))] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[rgba(var(--primary),0.2)]">
                Book Now
              </button>
            </Link>
            <div className="flex justify-center gap-4 text-gray-400">
              <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors"><Phone className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[rgb(var(--primary))] transition-colors"><Calendar className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}