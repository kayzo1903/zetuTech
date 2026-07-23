"use client";
import MessageForm from "./messageForm";

export default function Contacts() {
  return (
    <div className="w-full bg-black min-h-screen text-white font-sans pt-32 pb-24">
      
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-12 pb-24 border-b border-white/10">
        <h1 className="text-[14vw] leading-[0.8] tracking-tighter font-medium text-white/90 text-center uppercase relative z-10 pointer-events-none select-none">
          <span className="block opacity-80">- get in -</span>
          <span className="block opacity-40">touch</span>
        </h1>
        
        <div className="mt-16 text-center px-4 relative z-20">
          <p className="text-sm md:text-base font-light text-white/60 uppercase tracking-widest">
            Let&apos;s build the future together.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 grid grid-cols-1 lg:grid-cols-5 gap-16">
        
        {/* Contact Info (Left Column) */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Location</h2>
            <p className="text-xl font-light tracking-wide text-white/90">
              Magomeni Kanisani<br />
              <span className="text-sm text-white/60">Dar es Salaam, Tanzania</span>
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Direct Lines</h2>
            <div className="flex flex-col gap-2">
              <a href="tel:+255797465431" className="text-xl font-light tracking-wide text-white/90 hover:text-white transition-colors">
                +255 797 465 431
              </a>
              <a href="mailto:support@zetutech.co.tz" className="text-xl font-light tracking-wide text-white/90 hover:text-white transition-colors">
                support@zetutech.co.tz
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Business Hours</h2>
            <div className="flex flex-col gap-1 text-white/60 font-light">
              <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p>Sat: 10:00 AM - 4:00 PM</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">WhatsApp Support</h2>
            <a 
              href="https://wa.me/255797465431?text=Hello!%20I'm%20interested%20in%20your%20digital%20solutions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white/20 px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Start Chat
            </a>
          </div>

        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-3">
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm p-8 md:p-12">
            <h2 className="text-2xl font-medium uppercase tracking-wider mb-8">Send a Message</h2>
            {/* The MessageForm component will inherit dark styling based on its container */}
            <MessageForm type="contact" />
          </div>
        </div>

      </section>
    </div>
  );
}
