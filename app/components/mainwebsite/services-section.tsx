import { Plane } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { ServicesSkeleton } from "./Skeleton";

export default function ServicesSection({ loading }: { loading?: boolean }) {
  if (loading) return <ServicesSkeleton />;
  useTheme();

  const airports = [
    {
      name: "Gatwick Airport",
      description: "Reliable and stress-free transfers to and from Gatwick Airport, always on time.",
      link: "Learn More",
      featured: true,
    },
    {
      name: "Heathrow Airport",
      description: "Seamless and punctual Heathrow Airport transfers for a stress-free journey.",
      link: null,
      featured: false,
    },
    {
      name: "Luton Airport",
      description: "Effortless Luton Airport transfers with comfort, reliability, and great service.",
      link: null,
      featured: false,
    },
    {
      name: "Stansted Airport",
      description: "Smooth and dependable Stansted Airport transfers for a hassle-free travel experience.",
      link: null,
      featured: false,
    },
    {
      name: "London City Airport",
      description: "Fast and convenient London City Airport transfers for a seamless travel experience.",
      link: null,
      featured: false,
    },
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
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(var(--secondary),0.15),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(var(--primary),0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative text-center mb-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-white/[0.02] select-none pointer-events-none tracking-tighter italic whitespace-nowrap">
            FLEET SERVICES
          </div>
          <p className="text-[rgb(var(--primary))] font-bold mb-4 tracking-[0.4em] uppercase text-xs">Unmatched Coverage</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white text-balance tracking-tight leading-none mb-6">
            AIRPORT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))]">TRANSFERS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-lg font-light italic">
            Quick, reliable, and affordable airport transfers near you, ensuring a smooth, stress-free journey every time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airports.map((airport) => (
            <div
              key={airport.name}
              className={`group relative p-10 rounded-[2.5rem] transition-all duration-700 border ${airport.featured
                ? "bg-gradient-to-br from-white/10 to-white/5 border-[rgb(var(--primary))]/50 shadow-[0_20px_50px_rgba(var(--primary),0.1)]"
                : "bg-white/5 border-white/10 hover:border-[rgb(var(--primary))]/40"
                } overflow-hidden hover:shadow-[0_0_50px_rgba(var(--primary),0.15)] hover:-translate-y-2`}
            >
              {/* Spotlight Glow Effect */}
              <div className="absolute -inset-24 bg-gradient-to-tr from-[rgb(var(--primary))]/10 via-[rgb(var(--secondary))]/10 to-transparent opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700" />

              <div className="relative z-10">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg] ${airport.featured ? "bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] shadow-2xl shadow-[rgb(var(--primary))]/50" : "bg-white/10 border border-white/10 shadow-xl"
                    }`}
                >
                  <Plane
                    className={`w-10 h-10 ${airport.featured ? "text-white" : "text-[rgb(var(--primary))] group-hover:text-[rgb(var(--primary))]/80"} transition-colors`}
                  />
                  {/* Neon Ring Effect */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-700 scale-110 opacity-0 group-hover:opacity-100" />
                </div>

                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-[rgb(var(--primary))] transition-colors tracking-tight">{airport.name}</h3>
                <p
                  className={`leading-relaxed mb-8 text-base font-light ${airport.featured ? "text-gray-200" : "text-gray-400 group-hover:text-gray-300"
                    }`}
                >
                  {airport.description}
                </p>
                {airport.link && (
                  <button className="relative group/btn overflow-hidden px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[rgb(var(--primary))] font-bold flex items-center gap-3 transition-all duration-500 hover:bg-[rgb(var(--primary))] hover:text-white hover:shadow-lg hover:shadow-[rgb(var(--primary))]/40">
                    <span className="relative z-10">{airport.link}</span>
                    <Plane className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}