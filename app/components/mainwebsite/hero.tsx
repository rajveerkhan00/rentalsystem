import { BookingForm } from "../mainwebsite/bookingform"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        {/* Dynamic Background with Parallax Effect */}
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat transform scale-110 animate-float"
          style={{
            backgroundImage: `url('/luxury-airport-transfer-van.jpg')`,
          }}
        />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] bg-amber-400/50 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Enhanced Text Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 px-4 py-2 rounded-full animate-fade-in">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 font-semibold text-sm tracking-wider">
                PREMIUM SERVICE GUARANTEED
              </span>
            </div>

            {/* Main Headline with Gradient */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="block text-white">
                  Ride with Mr Transfers
                </span>
                <span className="block mt-2">
                  <span className="relative inline-block">
                    <span className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 blur-xl opacity-70 rounded-lg" />
                    <span className="relative bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                      No.1 UK
                    </span>
                  </span>
                </span>
              </h1>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 leading-tight">
                Airport Transfers
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl text-balance">
              Experience premium airport taxi services with real-time tracking, 
              professional drivers, and competitive pricing. Your journey, perfected.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: "24/7", label: "Service" },
                { value: "5★", label: "Rating" },
                { value: "15min", label: "Avg Wait" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:border-amber-500/30"
                >
                  <div className="text-2xl font-bold text-amber-300">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Booking Form with Animation */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-amber-600/10 to-transparent rounded-full blur-xl" />
            
            {/* Form Container with Glass Effect */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine" />
              
              {/* Form Header */}
              <div className="border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">✓</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Instant Quote</h3>
                    <p className="text-sm text-gray-300">Best price guaranteed</p>
                  </div>
                </div>
              </div>
              
              {/* Booking Form */}
              <div className="p-6">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}