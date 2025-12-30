import { Check, Info, Users, Briefcase } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../ThemeProvider";
import { SectionSkeleton } from "./Skeleton";

const vehicles = [
  {
    name: "Standard Sedan",
    image: "/vehicle-sedan.jpg",
    passengers: 4,
    luggage: 2,
    features: ["Meet & Greet", "60 min waiting", "Bottled Water", "Live Tracking"],
    price: "From £40",
    featured: false,
  },
  {
    name: "Executive Business",
    image: "/vehicle-executive.jpg",
    passengers: 3,
    luggage: 2,
    features: ["Premium Interior", "Extended Waiting", "Free WiFi", "Newspaper"],
    price: "From £65",
    featured: true,
  },
  {
    name: "Premium MPV",
    image: "/vehicle-mpv.jpg",
    passengers: 8,
    luggage: 8,
    features: ["Group Travel", "Bulky Luggage", "Extra Comfort", "Child Seats"],
    price: "From £85",
    featured: false,
  },
];

export default function TaxiRates({ loading }: { loading?: boolean }) {
  if (loading) return <SectionSkeleton cardCount={3} />;
  useTheme();

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="hidden md:block absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(var(--primary),0.1),transparent_35%)]" />
        <div className="hidden md:block absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(var(--secondary),0.1),transparent_35%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <p className="text-[rgb(var(--primary))] font-bold mb-4 tracking-[0.4em] uppercase text-xs">Transparent Pricing</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            FLEXIBLE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[rgb(var(--primary))] to-[rgb(var(--secondary))]">RATES</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))] mx-auto rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="group relative rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-3xl hover:border-[rgb(var(--primary))]/50 hover:shadow-[0_0_80px_rgba(var(--primary),0.15)] hover:-translate-y-4"
            >
              {/* Dynamic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--primary))]/5 via-transparent to-[rgb(var(--secondary))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative p-10 flex flex-col h-full">
                {/* Vehicle Image Glow */}
                <div className="absolute bottom-10 w-3/4 h-6 bg-[rgb(var(--primary))]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative aspect-[16/9] mb-8 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Price Tag */}
                  <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-[rgb(var(--primary))] text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-[rgb(var(--primary))]/40 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    {vehicle.price}
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-8 text-white group-hover:text-[rgb(var(--primary))] transition-colors uppercase tracking-tight leading-none">{vehicle.name}</h3>
                  <div className="space-y-4 mb-8">
                    {vehicle.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 group/item">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 flex-shrink-0 transition-all duration-500 group-hover/item:bg-[rgb(var(--primary))] group-hover/item:scale-110 group-hover/item:rotate-90">
                          <Check className="w-3.5 h-3.5 text-[rgb(var(--primary))] group-hover/item:text-white transition-colors" />
                        </div>
                        <span className="text-gray-400 group-hover:text-gray-200 text-sm font-medium transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="relative w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-[rgb(var(--primary))] hover:border-[rgb(var(--primary))] transition-all duration-500 group/btn overflow-hidden">
                  <span className="relative z-10 transition-colors group-hover/btn:text-white">Select Vehicle</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgb(var(--primary))] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}