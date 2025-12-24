import Image from "next/image"
import { Star, Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Xavier Mcfarla",
      role: "Business Traveler",
      image: "/professional-blonde-woman.png",
      text: "Exceptional service! My driver arrived on time, helped with my luggage, and provided a smooth, comfortable ride to Heathrow. The booking process was simple, and communication was excellent.",
      rating: 5,
    },
    {
      name: "Jordan Rein",
      role: "Frequent Flyer",
      image: "/professional-man-with-headphones.jpg",
      text: "A top-tier transfer experience! The driver was courteous, professional, and drove safely. I appreciated the real-time updates and the hassle-free journey. Definitely recommend!",
      rating: 5,
    },
    {
      name: "Devina Mueller",
      role: "Corporate Client",
      image: "/professional-woman-with-glasses-and-yellow-cardiga.jpg",
      text: "Mr Transfers exceeded my expectations! The car was spotless, the driver was friendly, and the entire trip was seamless. This is my go-to airport transfer service from now on!",
      rating: 5,
    },
  ]

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects - Matching Hero */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-100 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/testimonials-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(236,72,153,0.12),transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_90%_80%,rgba(168,85,247,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-pink-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-pink-500 to-rose-500"></span>
            </span>
            <span className="text-gray-200 font-medium text-xs tracking-[0.2em] uppercase">Customer Feedback</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            What Our Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-pink-500 to-rose-500">Say</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Trusted by thousands of travelers for seamless airport transfers with punctual service and professional drivers
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-pink-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-pink-500/10"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-pink-500/20 group-hover:text-pink-500/40 transition-colors" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-pink-400 fill-pink-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-8 text-sm">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-pink-500/30 ring-offset-2 ring-offset-black">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-white group-hover:text-pink-400 transition-colors">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 3).map((t, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                  <Image src={t.image} alt="" width={32} height={32} className="object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm">1000+ Happy Customers</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span className="text-sm">4.9/5 Average Rating</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-sm">99% Recommend Us</div>
        </div>
      </div>
    </section>
  )
}
