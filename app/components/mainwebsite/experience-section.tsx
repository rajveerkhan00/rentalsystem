import Image from "next/image";
import { useTheme } from "../ThemeProvider";
import { ExperienceSkeleton } from "./Skeleton";

export default function ExperienceSection({ loading }: { loading?: boolean }) {
  if (loading) return <ExperienceSkeleton />;
  useTheme();

  const stats = [
    { label: "Taxi Quality", percentage: 95 },
    { label: "Professional Driver", percentage: 86 },
    { label: "Affordable Pricing", percentage: 82 },
    { label: "Easy Booking", percentage: 86 },
  ];

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects - Hero Style */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('/blogbg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(var(--primary),0.15),transparent_35%)]" />
        <div className="hidden md:block absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        {/* Background Accent */}
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[rgb(var(--secondary))]/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0A]/40 backdrop-blur-sm shadow-2xl ring-1 ring-white/5">
          {/* Left Side - Stats */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-sm p-12 lg:p-20 flex flex-col justify-center border-r border-white/10 relative">
            <div className="absolute -top-6 -left-6 text-7xl font-bold text-white/[0.01] pointer-events-none select-none">EXPERIENCE</div>
            <p className="text-[rgb(var(--primary))] font-semibold mb-4 tracking-[0.3em] uppercase text-xs">Since 2015</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white text-balance tracking-tight leading-tight">
              Experienced Professionals <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))]">Unmatched Quality</span>
            </h2>
            <p className="text-gray-400 mb-16 leading-relaxed text-lg font-light max-w-md border-l border-[rgb(var(--primary))]/20 pl-6">
              With over a decade in the industry, Mr Transfers has been delivering reliable, comfortable, and punctual
              airport transfer services.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <div key={stat.label} className="group/stat">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-white text-sm font-bold uppercase tracking-wider group-hover/stat:text-[rgb(var(--primary))] transition-colors">
                      {stat.label}
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-[rgb(var(--primary))] to-white">
                      {stat.percentage}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))] rounded-full relative overflow-hidden"
                      style={{
                        width: `${stat.percentage}%`
                      }}
                    >
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image & Overlay Card with 3D feel */}
          <div className="relative group/side min-h-[500px]">
            <Image
              src="/modern-city-street-with-yellow-taxi-cab-at-dusk.jpg"
              alt="Professional airport transfer service"
              fill
              className="object-cover grayscale hover:grayscale-0"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-black/80 group-hover/side:opacity-40 transition-opacity" />

            {/* Overlay Card — Glassmorphism with magnetic feel hint */}
            <div className="absolute -bottom-10 -left-10 bg-[#0A0A0A]/95 backdrop-blur-sm p-10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] max-w-md border border-white/10 ring-1 ring-white/10">
              <div className="w-12 h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] mb-6 rounded-full" />
              <h3 className="text-2xl font-bold text-white tracking-tight mb-4 uppercase">PREMIUM ROADSIDE <br /><span className="text-[rgb(var(--primary))]">EXCELLENCE</span></h3>
              <p className="text-gray-400 leading-relaxed font-light text-base mb-6">
                Experience top-tier taxi service with professional drivers and unmatched convenience for every journey.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white/10 backdrop-blur-md" />
                  ))}
                </div>
                <span className="text-xs text-white/50 uppercase tracking-[0.2em]">Verified Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}