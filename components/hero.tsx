"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, AlertTriangle, Star, Shield, Truck } from "lucide-react";

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

// Utility: Calculate time until midnight
function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);

  const difference = midnight.getTime() - now.getTime();

  return difference > 0
    ? {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    : { hours: 0, minutes: 0, seconds: 0 };
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-cyan-200/30 dark:bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl space-y-6 text-center md:text-left"
        >
          {/* Live badge */}
          <div className="inline-flex items-center backdrop-blur-sm px-4 py-2 rounded-full border bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-500/30">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
            <span className="text-sm font-medium">Live stock updated</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover Premium{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              Laptops
            </span>
            <br />
            Curated Just for You
          </h1>

          {/* Description */}
          <p className="text-lg max-w-md mx-auto md:mx-0 text-gray-600 dark:text-gray-300">
            Shop high-performance laptops with unbeatable prices. New stock
            refreshes every 24 hours — get yours before it&apos;s gone.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <Truck className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm">Free Delivery</span>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <Shield className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm">1-Year Warranty</span>
            </div>
            <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <Star className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm">Premium Quality</span>
            </div>
          </div>

          {/* Limited stock & timer */}
          <div className="p-4 rounded-xl border backdrop-blur-sm shadow-md bg-white/50 border-gray-200/50 dark:bg-gray-800/50 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Stock info */}
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Limited stock</p>
                  <p className="font-bold">Only 3 left today!</p>
                </div>
              </div>

              {/* Countdown */}
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next refresh in
                </p>
                <div className="flex space-x-1 font-mono">
                  {["hours", "minutes", "seconds"].map((unit, index) => (
                    <span key={unit} className="flex items-center">
                      <span className="px-2 py-1 rounded text-sm font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900/80 dark:text-white">
                        {String(timeLeft[unit as keyof TimeLeft]).padStart(2, "0")}
                      </span>
                      {index < 2 && <span className="mx-1">:</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center"
            >
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <Link
              href="/about"
              className="px-8 py-4 rounded-xl text-lg font-semibold transition-all border flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Right Hero Image - Redesigned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full md:w-1/2 max-w-lg mx-auto mt-10 md:mt-0"
        >
          {/* Main laptop image with floating effect */}
          <motion.div
            className="relative z-10"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/laptop-sample.png"
                alt="Premium laptop showcase"
                width={600}
                height={400}
                className="object-cover w-full"
                priority
              />
              {/* Screen reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            {/* Floating elements around the laptop */}
            <motion.div 
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-20"
              animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: 1 }}
            >
              <div className="text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1 rounded">
                -25% OFF
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg z-20"
              animate={{ y: [0, 5, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
            >
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold ml-1">4.8</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Background decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-xl z-0"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-200/30 dark:bg-cyan-500/20 rounded-full blur-xl z-0"></div>
          
          {/* Floating circles in background */}
          <div className="absolute top-1/4 -left-6 w-16 h-16 bg-blue-100/50 dark:bg-blue-400/10 rounded-full z-0"></div>
          <div className="absolute bottom-1/4 -right-6 w-20 h-20 bg-cyan-100/50 dark:bg-cyan-400/10 rounded-full z-0"></div>
        </motion.div>
      </div>
    </section>
  );
}