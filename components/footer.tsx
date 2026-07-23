import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full bg-black text-white py-12 md:py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Minimal Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-bold tracking-tight">
              zetu<span className="font-light text-white/70">Tech</span>
            </span>
            <p className="text-sm text-white/50 font-light">
              Premium digital solutions and innovation.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 md:gap-x-16 gap-y-6 mt-8 md:mt-0">
            <Link href="/" className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">About Us</Link>
            <Link href="/services" className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">Services</Link>
            <Link href="/contact" className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">Contact</Link>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest text-white/40">
          <p>© {currentYear} zetuTech. All rights reserved.</p>
          
          <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms&policy" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:support@zetutech.co.tz" className="hover:text-white transition-colors">support@zetutech.co.tz</a>
          </div>
        </div>

      </div>
    </footer>
  )
}