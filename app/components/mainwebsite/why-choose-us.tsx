import { Shield, Clock, CreditCard, Check } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export default function WhyChooseUs() {
  useTheme();

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(var(--primary),0.1),transparent_35%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_70%,rgba(var(--secondary),0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-96 bg-gradient-to-r from-[rgb(var(--primary))]/5 via-[rgb(var(--secondary))]/5 to-[rgb(var(--primary))]/5 blur-[120px] rounded-full animate-pulse-slow pointer-events-none" />

          <p className="text-[rgb(var(--primary))] font-bold mb-4 tracking-[0.6em] uppercase text-xs">Unmatched Value</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6">
            TRUSTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-white bg-[length:200%_auto] animate-gradient-x">EXCELLENCE</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] mx-auto rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group relative bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] hover:border-[rgb(var(--primary))]/50 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_100px_rgba(var(--primary),0.15)] overflow-hidden">
            <div className="absolute -inset-40 bg-gradient-to-tr from-[rgb(var(--primary))]/10 via-transparent to-[rgb(var(--secondary))]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl" />

            <div className="relative z-10">
              <div className="bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-[rgb(var(--primary))]/50 group-hover:scale-110 transition-all duration-700">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase">Always On Time</h3>
              <p className="text-gray-400 font-light leading-relaxed mb-8">
                Punctuality is our priority. We monitor your flight status in real-time to ensure your driver is waiting when you arrive.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[rgb(var(--primary))] group-hover:border-[rgb(var(--primary))]/30 transition-colors">Clean Rides</span>
                <span className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[rgb(var(--secondary))] group-hover:border-[rgb(var(--secondary))]/30 transition-colors">Punctual</span>
              </div>
            </div>
          </div>

          {/* Card 2 Featured */}
          <div className="group relative bg-gradient-to-br from-[rgb(var(--primary))]/20 to-[rgb(var(--secondary))]/20 backdrop-blur-2xl border border-[rgb(var(--primary))]/30 p-10 rounded-[2.5rem] hover:border-[rgb(var(--primary))]/60 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_100px_rgba(var(--primary),0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--secondary))] to-[rgb(var(--primary))] opacity-50" />

            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-10 border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-700">
                <Shield className="w-10 h-10 text-[rgb(var(--primary))] animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase">Premium Safety</h3>
              <p className="text-gray-200 font-light leading-relaxed mb-8">
                Your safety is non-negotiable. All vehicles are regularly inspected, and our drivers are fully licensed and background-checked.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group/i">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary))]/20 flex items-center justify-center group-hover/i:bg-[rgb(var(--primary))] transition-colors">
                    <CreditCard className="w-5 h-5 text-[rgb(var(--primary))] group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">Direct Payments</span>
                </div>
                <div className="flex items-center gap-4 group/i">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--secondary))]/20 flex items-center justify-center group-hover/i:bg-[rgb(var(--secondary))] transition-colors">
                    <Shield className="w-5 h-5 text-[rgb(var(--secondary))] group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">Fully Insured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] hover:border-[rgb(var(--primary))]/50 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_100_rgba(var(--primary),0.15)] overflow-hidden">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-[rgb(var(--secondary))] to-[rgb(var(--primary))] w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-[rgb(var(--secondary))]/50 group-hover:scale-110 transition-all duration-700">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase">Professional Staff</h3>
              <p className="text-gray-400 font-light leading-relaxed mb-8">
                Our drivers are not just motorists; they are hospitality professionals trained to provide a premium experience.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 group/i">
                  <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))]/10 flex items-center justify-center border border-[rgb(var(--primary))]/20 group-hover/i:bg-[rgb(var(--primary))] transition-all duration-500">
                    <Check className="w-4 h-4 text-[rgb(var(--primary))] group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-xs text-gray-400 font-bold group-hover:text-white transition-colors">Expert</span>
                </div>
                <div className="flex items-center gap-3 group/i">
                  <div className="w-8 h-8 rounded-lg bg-[rgb(var(--secondary))]/10 flex items-center justify-center border border-[rgb(var(--secondary))]/20 group-hover/i:bg-[rgb(var(--secondary))] transition-all duration-500">
                    <Check className="w-4 h-4 text-[rgb(var(--secondary))] group-hover/i:text-white transition-colors" />
                  </div>
                  <span className="text-xs text-gray-400 font-bold group-hover:text-white transition-colors">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}