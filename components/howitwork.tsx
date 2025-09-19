"use client";

import { motion } from "framer-motion";
import {
  Package,
  PhoneCall,
  Truck,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    title: "1. Place Your Order",
    description:
      "Browse our latest laptops and submit your order with your name, phone, and address.",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "2. Confirm & Schedule",
    description:
      "Our team will call you to confirm your order details and delivery time.",
    icon: PhoneCall,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "3. Pay on Delivery",
    description:
      "Receive your laptop at your doorstep and pay upon delivery — no upfront payment required.",
    icon: Truck,
    color: "from-green-500 to-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:bg-blue-500/10 transform -skew-y-3 -translate-y-16" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 text-sm font-medium mb-6"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Simple 3-Step Process
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Works
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Get your favorite laptop in just three simple steps. Fast, easy, and
            reliable delivery with no upfront payment required.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-16 h-1 w-full md:w-2/3 -translate-x-0 md:-translate-x-1/4 bg-gray-200 dark:bg-gray-700" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="group relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750"
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gray-800 dark:bg-gray-700">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${step.color} text-white mb-5 mx-auto`}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 text-center text-gray-900 dark:text-white group-hover:opacity-90 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ready to get started?
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Browse our collection and place your order today.
              </p>
            </div>

            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-blue-500/30">
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </motion.div>

        {/* Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
            <span>100% Secure Payment</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Truck className="w-5 h-5 mr-2 text-blue-500" />
            <span>Free Delivery in City</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <CheckCircle className="w-5 h-5 mr-2 text-purple-500" />
            <span>7-Day Return Policy</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
