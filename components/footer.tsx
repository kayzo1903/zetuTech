import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ZetuTech</h2>
            <p className="mb-4 text-gray-400">
              Your trusted local laptop store in Tanzania.
            </p>
            
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-400 rounded transition">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 rounded transition">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-400 mr-2" />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-blue-400 mr-2" />
                <span>+255 700 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-blue-400 mr-2" />
                <span>support@zetutech.co.tz</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">We accept:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">Visa</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">MasterCard</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">M-Pesa</span>
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">Tigo Pesa</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ZetuTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}