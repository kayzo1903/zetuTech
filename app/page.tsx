import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="w-full bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[800px] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Full Bleed Kilimanjaro Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/kilimanjaro.jpg" 
            alt="Mount Kilimanjaro Background" 
            fill
            className="object-cover opacity-80"
            priority
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black via-transparent to-black/80" />
        </div>
        
        {/* Massive Centered Typography */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-20 pointer-events-none select-none">
          <h1 className="text-[12vw] leading-[0.85] tracking-tighter font-medium text-white text-center uppercase drop-shadow-2xl">
            <span className="block opacity-90">- the future -</span>
            <span className="block opacity-70">of innovation</span>
          </h1>
        </div>

        {/* Floating UI Elements */}
        <div className="absolute bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-4 md:left-12 z-20 flex flex-col gap-4 w-[90%] md:w-auto">
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium uppercase tracking-widest bg-black/50 backdrop-blur-md text-white/70">
              Technology
            </span>
            <span className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium uppercase tracking-widest bg-black/50 backdrop-blur-md text-white/70">
              Network
            </span>
            <span className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-medium uppercase tracking-widest bg-black/50 backdrop-blur-md text-white/70">
              Gaming
            </span>
          </div>
          <Button variant="outline" className="mt-4 rounded-none border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all w-fit text-xs uppercase tracking-widest px-8 py-6">
            Read More
          </Button>
        </div>

        <div className="hidden md:flex absolute top-1/2 right-4 lg:right-12 -translate-y-1/2 z-20 gap-4">
          <div className="border border-white/20 p-6 bg-black/50 backdrop-blur-md flex flex-col justify-between w-28 lg:w-32 aspect-square">
            <span className="text-3xl font-light">300+</span>
            <span className="text-[10px] uppercase text-white/50 tracking-widest leading-tight">Processed<br/>Client</span>
          </div>
          <div className="border border-white/20 p-6 bg-black/50 backdrop-blur-md flex flex-col justify-between w-32 aspect-square">
            <span className="text-3xl font-light">98%</span>
            <span className="text-[10px] uppercase text-white/50 tracking-widest leading-tight">Accuracy<br/>Increase</span>
          </div>
        </div>

      </section>



      {/* Statement Section */}
      <section className="w-full py-32 px-4 flex justify-center bg-black">
        <h2 className="max-w-4xl text-center text-3xl md:text-5xl font-light leading-tight tracking-tight text-white/90 uppercase">
          We make thinking faster, smarter,<br />
          and accessible for <span className="font-medium text-white">everyone</span> — from<br />
          <span className="text-white/30">curious beginners to power users.</span>
        </h2>
      </section>

      {/* Feature Grid Section */}
      <section className="w-full max-w-7xl mx-auto py-24 px-4 grid md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-start gap-6">
          <h3 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] uppercase">
            AI <span className="text-white/30">×</span> Humanity:<br/>
            <span className="text-white/30">One Future, One Force</span>
          </h3>
          <p className="text-sm text-white/50 max-w-md leading-relaxed font-light">
            Power your brand through seamless integration with next-generation AI systems. Build connections that continually adapt, evolve, and touch every digital touchpoint — from logic to emotion, from code to culture.
          </p>
          <Button variant="outline" className="mt-8 rounded-none border-white/20 bg-transparent hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest px-8 py-6">
            Explore Demo
          </Button>
        </div>
        
        <div className="relative w-full aspect-[4/3] border border-white/10 bg-zinc-900 rounded-sm overflow-hidden">
          <Image 
            src="/images/ai-chip.jpg" 
            alt="AI Processor" 
            fill
            className="object-cover opacity-90"
          />
        </div>
      </section>

    </main>
  );
}