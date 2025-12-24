import { Check } from "lucide-react";
import Image from "next/image";

export default function TaxiRates() {
  const vehicles = [
    {
      name: "Saloon Car",
      image: "/black-saloon-sedan-car-side-view.jpg",
      features: ["3 passengers", "3 standard suitcases", "23kg max", "OR 4 passengers plus hand luggage"],
    },
    {
      name: "Estate Car",
      image: "/black-estate-wagon-car-side-view.jpg",
      features: ["4 passengers", "4 standard suitcases", "23kg Max", "Door-to-Door Service"],
    },
    {
      name: "Executive Car",
      image: "/black-executive-luxury-sedan-side-view.jpg",
      features: ["3 passengers", "3 standard suitcases", "23kg max", "4 passengers plus hand luggage"],
    },
    {
      name: "MPV-6",
      image: "/black-mpv-minivan-6-seater-side-view.jpg",
      features: ["5 passengers", "5 standard suitcases", "23kg max", "6 passengers plus hand luggage"],
    },
    {
      name: "MPV-8",
      image: "/black-mpv-minivan-8-seater-side-view.jpg",
      features: ["8 passengers", "8 standard suitcases", "23kg max", "Direct to hotel door"],
    },
  ];

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects - Hero Style */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-105 animate-subtle-zoom"
          style={{ backgroundImage: `url('/blogbg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(236,72,153,0.1),transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_80%,rgba(168,85,247,0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative text-center mb-16">
          {/* Aggressive Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-bold text-white/[0.01] select-none pointer-events-none tracking-tighter whitespace-nowrap">
            BEST RATES
          </div>
          <p className="text-orange-500 font-bold mb-4 tracking-[0.5em] uppercase text-xs">Premium Fleet pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            FLEXIBLE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-500 to-purple-600">RATES</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 mx-auto rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="group relative rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-700 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-3xl hover:border-pink-500/50 hover:shadow-[0_0_80px_rgba(236,72,153,0.15)] hover:-translate-y-4"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative bg-white/[0.03] p-8 flex items-center justify-center h-64 border-b border-white/10 group-hover:bg-white/[0.05] transition-all duration-700">
                {/* Car Glow Shadow */}
                <div className="absolute bottom-10 w-3/4 h-6 bg-pink-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Image
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  width={400}
                  height={200}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-1000 group-hover:rotate-2"
                  priority={false}
                />

                {/* Badge Overlay */}
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-pink-500 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-pink-500/40 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  Top Choice
                </div>
              </div>

              <div className="p-10 relative">
                <h3 className="text-2xl font-bold mb-8 text-white group-hover:text-pink-400 transition-colors uppercase tracking-tight leading-none">{vehicle.name}</h3>
                <ul className="grid grid-cols-1 gap-4">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-pink-500/10 border border-pink-500/30 flex-shrink-0 transition-all duration-500 group-hover/item:bg-pink-500 group-hover/item:scale-110 group-hover/item:rotate-90">
                        <Check className="w-3.5 h-3.5 text-pink-500 group-hover/item:text-white transition-colors" />
                      </div>
                      <span className="text-gray-400 group-hover:text-white transition-colors text-sm font-medium tracking-wide uppercase text-[11px]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Trigger hint */}
                <div className="mt-12 w-full h-px bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}