"use client";

import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Star,
  ArrowRight,
  Heart,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Fast Local Delivery",
    description:
      "Get your laptop delivered the same day within the city or next day nationwide.",
    icon: Truck,
    color: "from-blue-500 to-cyan-500",
    delay: 0.1,
  },
  {
    title: "1-Year Warranty",
    description:
      "Peace of mind with every purchase. We cover you with a full year warranty.",
    icon: ShieldCheck,
    color: "from-green-500 to-emerald-500",
    delay: 0.2,
  },
  {
    title: "Daily Stock Updates",
    description:
      "Our inventory is updated every morning so you always see what's available today.",
    icon: RefreshCcw,
    color: "from-purple-500 to-pink-500",
    delay: 0.3,
  },
  {
    title: "Premium Quality",
    description:
      "Every laptop is thoroughly tested and certified to meet our high standards.",
    icon: BadgeCheck,
    color: "from-amber-500 to-orange-500",
    delay: 0.4,
  },
  {
    title: "30-Day Returns",
    description:
      "Not satisfied? Return within 30 days for a full refund, no questions asked.",
    icon: Heart,
    color: "from-rose-500 to-red-500",
    delay: 0.5,
  },
  {
    title: "24/7 Support",
    description:
      "Our expert team is available around the clock to assist with any questions.",
    icon: Clock,
    color: "from-indigo-500 to-blue-500",
    delay: 0.6,
  },
];

export default function WhyBuy() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:bg-blue-500/10 transform -skew-y-3 -translate-y-16"></div>

      <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl dark:bg-purple-500/5"></div>
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/5"></div>

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 mr-2 fill-current" />
            Trusted by thousands of customers
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              ZetuTech
            </span>
            ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            We&apos;re not just selling laptops — we&apos;re providing peace of mind with
            every purchase through our exceptional service and quality
            guarantees.
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
                className="group relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750"
              >
                {/* Gradient top border */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${benefit.color}`}
                ></div>

                {/* Icon with gradient background */}
                <motion.div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${benefit.color} text-white mb-5`}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <IconComponent className="w-6 h-6" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 group-hover:opacity-90 transition-colors text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4 text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>

                {/* Learn more link */}
                <div className="flex items-center text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
