"use client"

import { Truck, ShieldCheck, RefreshCcw, Star, ArrowRight, Heart, Clock, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

const benefits = [
  {
    title: "Fast Local Delivery",
    description: "Get your laptop delivered the same day within the city or next day nationwide.",
    icon: Truck,
    color: "from-blue-500 to-cyan-500",
    darkColor: "from-blue-400 to-cyan-400",
    delay: 0.1
  },
  {
    title: "1-Year Warranty",
    description: "Peace of mind with every purchase. We cover you with a full year warranty.",
    icon: ShieldCheck,
    color: "from-green-500 to-emerald-500",
    darkColor: "from-green-400 to-emerald-400",
    delay: 0.2
  },
  {
    title: "Daily Stock Updates",
    description: "Our inventory is updated every morning so you always see what's available today.",
    icon: RefreshCcw,
    color: "from-purple-500 to-pink-500",
    darkColor: "from-purple-400 to-pink-400",
    delay: 0.3
  },
  {
    title: "Premium Quality",
    description: "Every laptop is thoroughly tested and certified to meet our high standards.",
    icon: BadgeCheck,
    color: "from-amber-500 to-orange-500",
    darkColor: "from-amber-400 to-orange-400",
    delay: 0.4
  },
  {
    title: "30-Day Returns",
    description: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
    icon: Heart,
    color: "from-rose-500 to-red-500",
    darkColor: "from-rose-400 to-red-400",
    delay: 0.5
  },
  {
    title: "24/7 Support",
    description: "Our expert team is available around the clock to assist with any questions.",
    icon: Clock,
    color: "from-indigo-500 to-blue-500",
    darkColor: "from-indigo-400 to-blue-400",
    delay: 0.6
  }
]

export default function WhyBuy() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark";
  


  return (
    <section className={`relative py-20 overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Background decorative elements */}
      <div className={`absolute top-0 left-0 w-full h-72 ${isDarkMode ? 'bg-blue-500/10' : 'bg-gradient-to-r from-blue-500/5 to-cyan-500/5'} transform -skew-y-3 -translate-y-16`}></div>
      {isDarkMode ? (
        <>
          <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        </>
      ) : (
        <>
          <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </>
      )}
      
      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center px-4 py-2 rounded-full ${isDarkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-700'} text-sm font-medium mb-6`}
          >
            <Star className="w-4 h-4 mr-2 fill-current" />
            Trusted by thousands of customers
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">ZetuTech</span>?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            We&apos;re not just selling laptops - we&apos;re providing peace of mind with every purchase through our exceptional service and quality guarantees.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: benefit.delay }}
                whileHover={{ y: -5 }}
                className={`group relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
              >
                {/* Gradient top border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isDarkMode ? benefit.darkColor : benefit.color}`}></div>
                
                {/* Icon with gradient background */}
                <motion.div 
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${isDarkMode ? benefit.darkColor : benefit.color} text-white mb-5`}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconComponent className="w-6 h-6" />
                </motion.div>
                
                {/* Title */}
                <h3 className={`text-xl font-semibold mb-3 group-hover:opacity-90 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {benefit.title}
                </h3>
                
                {/* Description */}
                <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {benefit.description}
                </p>
                
                {/* Learn more link */}
                <div className="flex items-center text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
                
                {/* Hover effect background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${isDarkMode ? 'bg-gradient-to-br from-gray-750 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'}`}></div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className={`mt-16 rounded-2xl shadow-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10,000+</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Happy Customers</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>98%</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>24/7</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support Available</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,200+</div>
            <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Products Available</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-blue-500/30">
            Explore Our Collection
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <p className={`text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Free shipping on orders over $499</p>
        </motion.div>
      </div>
    </section>
  )
}