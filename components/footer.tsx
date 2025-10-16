import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Laptop } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gradient-to-r from-gray-50 via-white to-gray-100 
        dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 
        text-gray-900 dark:text-white text-xs sm:text-sm border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Laptop className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">ZetuTech</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for premium laptops and tech solutions in Tanzania. Quality devices, expert support.
            </p>
            
            {/* Social Links - Minimal */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#", color: "hover:text-blue-600" },
                { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                { icon: Instagram, href: "#", color: "hover:text-pink-600" },
                { icon: Mail, href: "mailto:support@zetutech.co.tz", color: "hover:text-gray-600" }
              ].map(({ icon: Icon, href, color ,} , index) => (
                <Link
                  key={index}
                  href={href}
                  className={`text-gray-400 transition-colors ${color} p-1`}
                  aria-label="Social media link"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links - Organized */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products?category=gaming" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=business" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Business Laptops
                </Link>
              </li>
              <li>
                <Link href="/products?category=student" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Student Laptops
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/warranty" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Warranty Info
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Tech Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Compact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <a href="tel:+255700123456" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  +255 700 123 456
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <a href="mailto:support@zetutech.co.tz" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  support@zetutech.co.tz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Trust Section */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">SECURE PAYMENT METHODS:</span>
              <div className="flex gap-2">
                {['Visa', 'MasterCard', 'M-Pesa', 'Airtel Money', 'Tigo Pesa'].map((method) => (
                  <span 
                    key={method}
                    className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>✓ 1-Year Warranty</span>
              <span>✓ Free Delivery in Dar</span>
              <span>✓ Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-6 pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
            <p>
              © {currentYear} ZetuTech. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms&policy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}