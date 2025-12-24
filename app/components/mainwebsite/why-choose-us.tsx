import { DollarSign, Shield, CreditCard, Check } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects - Hero Style */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-105 animate-subtle-zoom"
          style={{ backgroundImage: `url('/blogbg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative text-center mb-16">
          {/* Abstract Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-96 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-pink-500/5 blur-[120px] rounded-full animate-pulse-slow pointer-events-none" />

          <p className="text-pink-500 font-bold mb-4 tracking-[0.6em] uppercase text-xs">Unmatched Value</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white text-balance tracking-tight mb-8">
            TRUSTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-white bg-[length:200%_auto] animate-gradient-x">EXCELLENCE</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-lg font-light">
            Your Trusted UK Affordable Airport Transfers & Airport Taxis since 2015.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Terminal Drop-off Card */}
          <div className="group relative bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] hover:border-pink-500/50 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_100px_rgba(236,72,153,0.15)] overflow-hidden">
            {/* Card Spotlight */}
            <div className="absolute -inset-40 bg-gradient-to-tr from-pink-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl" />

            <div className="relative z-10">
              <div className="bg-gradient-to-br from-pink-600 to-purple-700 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-pink-500/50 group-hover:scale-110 transition-all duration-700">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white tracking-tight uppercase">Terminal <br />Drop-off</h3>
              <p className="text-gray-400 mb-10 leading-relaxed font-light text-base">
                We will drop you off at your terminal in Gatwick airport, well in advance of your flight so you have
                enough time to check-in.
              </p>
              <div className="flex gap-3 flex-wrap">
                <span className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-pink-400 group-hover:border-pink-500/30 transition-colors">Clean Rides</span>
                <span className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">Punctual</span>
              </div>
            </div>
          </div>

          {/* Friendly Drivers Card */}
          <div className="group relative bg-gradient-to-br from-pink-600/20 to-purple-800/20 backdrop-blur-2xl border border-pink-500/30 p-10 rounded-[2.5rem] hover:border-pink-400/60 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_100px_rgba(236,72,153,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-50" />

            <div className="relative z-10">
              <div className="bg-white/10 border border-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-700 shadow-2xl">
                <Shield className="w-10 h-10 text-pink-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white tracking-tight uppercase">Professional <br />Chauffeurs</h3>
              <p className="text-gray-300 mb-10 leading-relaxed font-normal text-base">
                Mr Transfers drivers are not only good with directions, but they're also friendly and polite. Elite service guaranteed.
              </p>
              <div className="flex gap-6 flex-wrap mt-auto">
                <div className="flex items-center gap-3 group/i">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover/i:bg-pink-500 transition-colors">
                    <CreditCard className="w-5 h-5 text-pink-400 group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Guarantee</span>
                </div>
                <div className="flex items-center gap-3 group/i">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover/i:bg-purple-500 transition-colors">
                    <Shield className="w-5 h-5 text-purple-400 group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Reliable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Rates Card */}
          <div className="group relative bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] hover:border-pink-500/50 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_100px_rgba(236,72,153,0.15)] overflow-hidden">
            <div className="absolute top-0 right-0 p-10 text-white/[0.03] text-4xl font-bold pointer-events-none">FIXED</div>

            <div className="relative z-10">
              <div className="bg-gradient-to-br from-purple-600 to-pink-700 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-all duration-700">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white tracking-tight uppercase">Competitive <br />Rates</h3>
              <p className="text-gray-400 mb-10 leading-relaxed font-light text-base">
                Mr Transfers provide a high-quality service at a very competitive price. All our prices are fixed and
                affordable.
              </p>
              <div className="space-y-5">
                <div className="flex items-center gap-4 group/i">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover/i:bg-pink-500 transition-all duration-500">
                    <Check className="w-4 h-4 text-pink-500 group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] group-hover/i:text-white transition-colors">Available 24/7</span>
                </div>
                <div className="flex items-center gap-4 group/i">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover/i:bg-purple-500 transition-all duration-500">
                    <Check className="w-4 h-4 text-purple-500 group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] group-hover/i:text-white transition-colors">Easy Booking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}