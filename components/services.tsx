import Image from "next/image";

export default function ServicesPageContent() {
  return (
    <div className="w-full bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black pt-32">
      
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden border-b border-white/10">
        <h1 className="text-[14vw] leading-[0.8] tracking-tighter font-medium text-white/90 text-center uppercase relative z-10 pointer-events-none select-none">
          <span className="block opacity-80">- our -</span>
          <span className="block opacity-40">services</span>
        </h1>
        
        <div className="mt-16 md:mt-24 max-w-3xl text-center px-4 relative z-20">
          <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed uppercase tracking-wide">
            Next-generation digital solutions engineered for scale and innovation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-32 px-4 max-w-7xl mx-auto border-b border-white/10">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-12 hover:bg-white/10 transition-colors group">
            <h3 className="text-2xl font-medium mb-4 uppercase tracking-wider">AI Integration</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light mb-8">
              We implement intelligent logic and machine learning models into existing business infrastructures to automate processes and unlock new capabilities.
            </p>
            <div className="w-full h-[1px] bg-white/20 group-hover:bg-white transition-colors" />
          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-12 hover:bg-white/10 transition-colors group">
            <h3 className="text-2xl font-medium mb-4 uppercase tracking-wider">Web Apps</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light mb-8">
              High-performance, beautifully designed web platforms engineered to deliver exceptional user experiences and robust functionality.
            </p>
            <div className="w-full h-[1px] bg-white/20 group-hover:bg-white transition-colors" />
          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-12 hover:bg-white/10 transition-colors group">
            <h3 className="text-2xl font-medium mb-4 uppercase tracking-wider">Network Arch</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light mb-8">
              Scalable, secure network infrastructures designed to support heavy enterprise operations and ensure seamless connectivity.
            </p>
            <div className="w-full h-[1px] bg-white/20 group-hover:bg-white transition-colors" />
          </div>

        </div>
      </section>

      {/* Tzdraft Platform Section */}
      <section className="w-full py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          {/* Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <span className="text-[10px] uppercase tracking-widest text-white/40">Our Proprietary Product</span>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight uppercase leading-[0.9]">
              Tzdraft <br />
              <span className="font-light opacity-60">Platform</span>
            </h2>
            <p className="text-white/60 font-light leading-relaxed max-w-md">
              A digital manifestation of our strategic thinking. The Tzdraft Platform is an innovative online multiplayer experience featuring live match tracking, game history analysis, and competitive leaderboards designed to challenge the mind and build strategic foresight.
            </p>
            <a 
              href="https://tzdraft.co.tz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit px-8 py-4 border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-colors text-xs uppercase tracking-widest font-medium mt-4 inline-block text-center"
            >
              Explore the Platform
            </a>
          </div>

          {/* Visual */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-video border border-white/10 bg-black overflow-hidden group rounded-xl shadow-2xl">
              <Image 
                src="/images/tzdraft-app.png" 
                alt="Tzdraft Dashboard" 
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
