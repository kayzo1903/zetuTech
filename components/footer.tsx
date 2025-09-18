import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                ZetuTech
              </span>
            </h2>
            <p className="mb-4 text-gray-400">
              Your trusted local laptop store. Quality devices at unbeatable prices,
              with delivery right to your door across Tanzania.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-400 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white transition flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition flex items-center">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span>+255 700 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                <span>support@zetutech.co.tz</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 4:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="mb-4 text-gray-400">Subscribe to our newsletter for the latest products and offers.</p>
            
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                Subscribe
              </button>
            </form>
            
            <p className="mt-3 text-xs text-gray-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">We accept:</p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 px-3 py-1 rounded-md text-sm">Visa</div>
              <div className="bg-gray-800 px-3 py-1 rounded-md text-sm">MasterCard</div>
              <div className="bg-gray-800 px-3 py-1 rounded-md text-sm">M-Pesa</div>
              <div className="bg-gray-800 px-3 py-1 rounded-md text-sm">Tigo Pesa</div>
              <div className="bg-gray-800 px-3 py-1 rounded-md text-sm">Airtel Money</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ZetuTech. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition">Privacy Policy</Link>
              <Link href="/terms&policy" className="hover:text-gray-300 transition">Terms of Service</Link>
              <Link href="/return" className="hover:text-gray-300 transition">Return Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}