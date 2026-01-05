import RentResults from "./RentResults"
import { ShieldCheck, Star, Clock } from "lucide-react";
import { useEffect } from "react";

export function Hero(props: any) {
  const domainName = props.domainData?.domain?.domainName || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from your deployed Vercel domain
      if (event.origin !== 'https://booking-system-rouge-phi.vercel.app') return;

      if (event.data && event.data.type === 'resize') {
        const iframe = document.getElementById('booking-iframe') as HTMLIFrameElement;
        if (iframe) {
          // We add a little extra padding for safety
          iframe.style.height = (event.data.height) + 'px';
        }
      }

      // Handle search button click from iframe
      if (event.data && event.data.type === 'searchClicked') {
        console.log('🔔 Received searchClicked message from iframe!');
        console.log('📋 Form data:', event.data.formData);

        // Store the form data in sessionStorage
        sessionStorage.setItem('bookingFormData', JSON.stringify(event.data.formData));
        console.log('💾 Saved to sessionStorage');

        // Navigate to booking page
        console.log('🚀 Navigating to /booking...');
        window.location.href = '/booking';
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0 bg-black">
      {/* 1. Dynamic Background & Lighting */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-60 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ backgroundImage: `url('/luxury-airport-transfer-van.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_50%,rgba(var(--primary),0.15),transparent_25%)]" />
        <div className="hidden md:block absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_85%_30%,rgba(var(--secondary),0.15),transparent_25%)]" />

        {/* Animated Particles */}
        <div className="hidden md:block absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1fr_2.5fr] gap-8 items-center">

          {/* Left Side: Typography & Value Prop */}
          <div className="space-y-10 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#0A0A0A]/80 border border-white/10 shadow-lg shadow-[rgba(var(--primary),0.1)] hover:bg-white/10 transition-colors cursor-default group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--primary))] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))]"></span>
              </span>
              <span className="text-gray-200 font-medium text-xs tracking-[0.2em] uppercase group-hover:text-white transition-colors">Premium Chauffeur Service</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                {props.domainData?.siteContent?.heroTitle || 'Ride with'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--primary))] to-[rgb(var(--gradient-to))]">
                  {props.domainData?.siteContent?.websiteName || 'Mr Transfers'}
                </span>
              </h1>

              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-white/20"></div>
                <h2 className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                  {props.domainData?.siteContent?.heroSubtitle || 'No.1 UK Airport Transfers'}
                </h2>
              </div>

              <p className="text-lg text-gray-400 leading-relaxed max-w-lg font-light">
                Experience the epitome of luxury and reliability.
                Zero hidden fees, 99.9% on-time arrival, and professional chauffeurs at your service.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-5 border-t border-white/10 pt-8">
              {[
                { label: 'Rating', value: '4.9/5', sub: 'TrustPilot' },
                { label: 'Fleets', value: '500+', sub: 'Luxury Cars' },
                { label: 'Support', value: '24/7', sub: 'Live Chat' },
              ].map((stat, i) => (
                <div key={i} className="group cursor-default transition-all hover:translate-y-[-2px]">
                  <h4 className="text-3xl font-bold text-white mb-1 group-hover:text-[rgb(var(--primary))] transition-colors">{stat.value}</h4>
                  <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:ml-50 md:mt-30">
            {/* Right Side: Form Card */}
            <div className="relative w-full max-w-[1200px] mx-auto lg:ml-auto">
              {/* Glow Behind Form */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              {/* Glass Card */}
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                {/* Header */}
                <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Get Instant Quote</h3>
                    <p className="text-xs text-[rgb(var(--primary))] mt-1 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--primary))]"></span>
                      Best Price Guaranteed
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-white/10 to-transparent rounded-lg border border-white/10">
                    <span className="text-xl">⚡</span>
                  </div>
                </div>

                <div className="p-0">
                  <div id="booking-container" style={{ width: '100%' }}>
                    <iframe
                      id="booking-iframe"
                      src={`https://booking-system-rouge-phi.vercel.app/embed?domain=${domainName}&hide-bg=true&hide-header=true&redirectOnSearch=true`}
                      width="100%"
                      height="700"
                      style={{ border: 'none', minHeight: '500px' }}
                      scrolling="no"
                      title="Booking Form"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholder for trust badges/logos if needed (Visa, Stripe, etc) - visually represented by text for now */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Popup Overlay */}
      {
        (props.distance !== null || props.rent !== null) && (
          <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-6 flex justify-center pointer-events-none">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
              <RentResults
                distance={props.distance}
                rent={props.rent}
                hasTraffic={props.hasTraffic}
                routeInstructions={props.routeInstructions}
                formData={props.formData}
                domainData={props.domainData}
                onClose={() => {
                  props.onDistanceChange(null);
                  props.onRentChange(null);
                  props.onMapRouteChange(null);
                }}
              />
            </div>
          </div>
        )
      }
    </section >
  )
}