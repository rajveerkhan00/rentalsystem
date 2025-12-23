"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Calendar, ChevronDown, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [airportOpen, setAirportOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-gray-900 text-gray-300 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Contact Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="mailto:info@mrtransfers.com"
              className="flex items-center gap-2 hover:text-pink-500 transition-colors"
            >
              <Mail className="size-4" />
            </Link>
            <Link
              href="tel:+1234567890"
              className="flex items-center gap-2 hover:text-pink-500 transition-colors"
            >
              <Phone className="size-4" />
            </Link>
            <Link
              href="/booking"
              className="flex items-center gap-2 hover:text-pink-500 transition-colors"
            >
              <Calendar className="size-4" />
            </Link>
          </div>

          {/* Promotional Text */}
          <div className="flex-1 text-center md:text-right">
            <p className="text-sm">
              We Provide{" "}
              <span className="text-pink-500 font-medium">The Best Taxi Services & Discounts</span> For You
            </p>
          </div>
        </div>
      </div>

      {/* Floating Navigation Bar */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <svg viewBox="0 0 60 60" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* pink circle background */}
                    <circle cx="30" cy="30" r="28" fill="#ec4899" /> {/* pink-500 */}
                  {/* Taxi silhouette */}
                  <path
                    d="M15 35h30v5c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1h-14v1c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-5z"
                    fill="currentColor"
                    className="text-gray-900"
                  />
                  <path
                    d="M18 35l2-8h20l2 8M20 38h4M36 38h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-gray-900"
                  />
                  {/* City skyline */}
                  <path
                    d="M12 25h4v-8h-4v8zM18 25h3v-5h-3v5zM23 25h3v-10h-3v10zM28 25h3v-7h-3v7zM33 25h4v-9h-4v9zM39 25h3v-6h-3v6zM44 25h4v-8h-4v8z"
                    fill="currentColor"
                    className="text-gray-900"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 leading-tight">MR TRANSFERS</span>
                <span className="text-xs text-pink-500 font-medium leading-tight">BETTER AND FASTER</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-pink-500 font-medium hover:text-pink-400 transition-colors"
              >
                Home
              </Link>

              {/* Airport Dropdown - hover-based */}
              <div
                className="relative group"
                onMouseEnter={() => setAirportOpen(true)}
                onMouseLeave={() => setAirportOpen(false)}
              >
                <button className="flex items-center gap-1 text-gray-800 font-medium hover:text-pink-500 transition-colors focus:outline-none">
                  Airport Transfers
                  <ChevronDown className="size-4" />
                </button>
                {airportOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                    <Link
                      href="/airport/heathrow"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Heathrow Airport
                    </Link>
                    <Link
                      href="/airport/gatwick"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Gatwick Airport
                    </Link>
                    <Link
                      href="/airport/stansted"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Stansted Airport
                    </Link>
                    <Link
                      href="/airport/luton"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Luton Airport
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/areas"
                className="text-gray-800 font-medium hover:text-pink-500 transition-colors"
              >
                Areas We Cover
              </Link>

              {/* Blog Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setBlogOpen(true)}
                onMouseLeave={() => setBlogOpen(false)}
              >
                <button className="flex items-center gap-1 text-gray-800 font-medium hover:text-pink-500 transition-colors focus:outline-none">
                  Blog
                  <ChevronDown className="size-4" />
                </button>
                {blogOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                    <Link
                      href="/blog"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      All Posts
                    </Link>
                    <Link
                      href="/blog/travel-tips"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Travel Tips
                    </Link>
                    <Link
                      href="/blog/news"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Company News
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="text-gray-800 font-medium hover:text-pink-500 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Link href="/booking">
                <button className="bg-pink-500 text-gray-900 hover:bg-pink-400 font-bold px-6 py-2 rounded-full transition-colors">
                  Book now!
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <Link
              href="/"
              className="text-pink-500 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-800 font-medium mb-2">Airport Transfers</p>
              <div className="pl-4 flex flex-col gap-2">
                {["heathrow", "gatwick", "stansted", "luton"].map((airport) => (
                  <Link
                    key={airport}
                    href={`/airport/${airport}`}
                    className="text-gray-800 py-1 hover:text-pink-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {airport.charAt(0).toUpperCase() + airport.slice(1)} Airport
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/areas"
              className="text-gray-800 font-medium py-2 border-t border-gray-200 pt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Areas We Cover
            </Link>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-800 font-medium mb-2">Blog</p>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  href="/blog"
                  className="text-gray-800 py-1 hover:text-pink-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Posts
                </Link>
                <Link
                  href="/blog/travel-tips"
                  className="text-gray-800 py-1 hover:text-pink-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Travel Tips
                </Link>
                <Link
                  href="/blog/news"
                  className="text-gray-800 py-1 hover:text-pink-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Company News
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              className="text-gray-800 font-medium py-2 border-t border-gray-200 pt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <Link href="/booking">
              <button
                className="bg-pink-500 text-gray-900 hover:bg-pink-400 font-bold py-2 px-6 rounded-full mt-4 w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book now!
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}