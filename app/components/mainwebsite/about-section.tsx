import { Map, Car } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../ThemeProvider";
import { AboutSkeleton } from "./Skeleton";

export default function AboutSection({ loading }: { loading?: boolean }) {
  if (loading) return <AboutSkeleton />;
  useTheme();

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects - Hero Style */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-105 animate-subtle-zoom"
          style={{ backgroundImage: `url('/blogbg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(var(--primary),0.15),transparent_35%)] animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_70%,rgba(var(--secondary),0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        {/* Aggressive Background Decoration */}
        <div className="absolute -top-12 -left-10 text-[12rem] font-bold text-white/[0.01] select-none pointer-events-none tracking-tighter">
          ABOUT
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side - Image with Magnetic Effect logic (abstracted via group-hover for now) */}
          <div className="relative group/image">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover/image:scale-[1.02] group-hover/image:rotate-1">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <Image
                src="/luxury-airport-transfer-van.jpg"
                alt="Professional driver assisting with luggage"
                width={600}
                height={700}
                className="w-full h-full object-cover"
                priority={false}
              />
            </div>

            {/* Testimonial Card Overlay — Glassmorphism with Floating Animation */}
            <div className="absolute -bottom-8 -right-8 lg:right-[-40px] bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_20px_50px_rgba(var(--primary),0.2)] ring-1 ring-white/5 max-w-[320px] animate-float z-20">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full flex items-center justify-center shadow-lg shadow-[rgb(var(--primary))]/30">
                <span className="text-white text-2xl">"</span>
              </div>
              <div className="border-l-2 border-[rgb(var(--primary))] pl-4 mb-4">
                <p className="text-gray-300 italic leading-relaxed text-sm">
                  "Mr Transfers is UK's Leading ground transportation service for airport transfers, corporate travel... timeliness, comfort, and customer satisfaction."
                </p>
              </div>
              <p className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-6 h-px bg-[rgb(var(--primary))]/50"></span>
                Chase Foster
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--primary))] animate-pulse"></span>
                <p className="text-[rgb(var(--primary))] font-bold tracking-[0.2em] uppercase text-[10px]">Over 10 Years Experience</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-balance tracking-tight leading-tight">
                TAXI TRANSFERS TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))] bg-[length:200%_auto] animate-gradient-x">ALL LONDON AIRPORTS</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-light max-w-xl border-l border-white/10 pl-6">
                We specialize in making your travels through the UK's busiest airports as smooth as possible. Headquartered at Gatwick, serving the nation.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Door-to-Door Service */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex items-start gap-6 group hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] hover:-translate-y-1">
                <div className="relative">
                  <div className="absolute -inset-2 bg-[rgb(var(--primary))]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[rgb(var(--primary))]/40 group-hover:rotate-12 transition-transform duration-500">
                    <Map className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[rgb(var(--primary))] transition-colors tracking-tight">DOOR-TO-DOOR PREMIUM</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-light">
                    Our trusted and dedicated team is ready to pick you up from your location and ensure a smooth and
                    comfortable ride to your desired location.
                  </p>
                </div>
              </div>

              {/* Taxi Tour Services */}
              <div className="bg-gradient-to-r from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 border border-[rgb(var(--primary))]/20 p-6 rounded-2xl flex items-start gap-4 group hover:border-[rgb(var(--primary))]/40 transition-colors duration-300">
                <div className="bg-white/10 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Car className="w-7 h-7 text-[rgb(var(--primary))]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">Taxi Tour Services</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Our mission is to provide you with the first-class service you deserve. We pride ourselves on
                    reliability, punctuality, and exceptional customer service. When you choose us, you're choosing a
                    stress-free and convenient travel experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 mt-12">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[rgb(var(--primary))]/30">
                <Image
                  src="/professional-woman-with-glasses-and-yellow-cardiga.jpg"
                  alt="Customer service"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-[0.2em]">We Are Available 24 Hours</p>
                <p className="text-lg font-bold text-white">
                  For Booking: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] font-black tracking-wider">(+44) 7491 321 209</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div >
    </section >
  );
}