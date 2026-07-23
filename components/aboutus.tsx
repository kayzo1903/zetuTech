export default function AboutUs() {
  return (
    <div className="w-full bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black pt-32">
      
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden border-b border-white/10">
        <h1 className="text-[14vw] leading-[0.8] tracking-tighter font-medium text-white/90 text-center uppercase relative z-10 pointer-events-none select-none">
          <span className="block opacity-80">- about -</span>
          <span className="block opacity-40">zetutech</span>
        </h1>
        
        <div className="mt-16 md:mt-24 max-w-3xl text-center px-4 relative z-20">
          <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed uppercase tracking-wide">
            Pioneering the future of technology in Tanzania and beyond through AI, innovation, and digital excellence.
          </p>
        </div>
      </section>

      {/* The Mission */}
      <section className="w-full py-32 px-4 flex justify-center border-b border-white/10">
        <div className="max-w-4xl flex flex-col gap-8 text-center">
          <span className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Our Mission</span>
          <h2 className="text-3xl md:text-5xl font-light leading-tight tracking-tight text-white/90 uppercase">
            We are driven by <span className="font-medium text-white">innovation</span>.<br/>
            Focusing on utilizing <span className="font-medium text-white">AI</span> to create<br/>
            products that improve <span className="text-white/30">living standards.</span>
          </h2>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="w-full py-32 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Core Values</span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mt-6 uppercase">The principles we build on</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-12 hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-8 group-hover:border-white/60 transition-colors">
              <span className="text-xs">01</span>
            </div>
            <h3 className="text-2xl font-medium mb-4 uppercase tracking-wider">Innovation</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              We never settle for the standard. We constantly explore bleeding-edge technologies and artificial intelligence to deliver next-generation solutions.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-12 hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-8 group-hover:border-white/60 transition-colors">
              <span className="text-xs">02</span>
            </div>
            <h3 className="text-2xl font-medium mb-4 uppercase tracking-wider">Precision</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Quality is engineered into every product. We believe in meticulous attention to detail, from backend architecture to frontend aesthetics.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-12 hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-8 group-hover:border-white/60 transition-colors">
              <span className="text-xs">03</span>
            </div>
            <h3 className="text-2xl font-medium mb-4 uppercase tracking-wider">Impact</h3>
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Technology should serve humanity. Our ultimate goal is to create products that solve real-world problems and tangibly improve living standards.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 bg-white text-black flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase mb-6">Build the future with us</h2>
        <p className="text-black/60 max-w-lg mb-10 font-light">
          Whether you need a cutting-edge web application, AI integration, or complete digital transformation, zetuTech is your partner.
        </p>
        <a 
          href="/contact" 
          className="px-12 py-5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-black/80 transition-colors"
        >
          Get in Touch
        </a>
      </section>

    </div>
  );
}