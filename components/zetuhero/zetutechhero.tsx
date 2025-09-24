"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Brand,
  Category,
  ProductType,
  TOP_BRANDS,
  TOP_CATEGORIES,
  TOP_PRODUCT_TYPES,
} from "@/lib/data/hero-data";
import { ArrowRight, Plus } from "lucide-react";

export default function ZetutechHero(): JSX.Element {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-8">
      {/* HERO TOP BANNER */}
      <div
        className="relative rounded-2xl overflow-hidden 
  bg-gradient-to-r from-gray-50 via-white to-gray-100 
  dark:from-slate-800 dark:via-slate-900 dark:to-slate-950
  text-gray-900 dark:text-white 
  p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center transition-colors duration-300"
      >
        {/* Left Section */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Discover Quality Tech at Your Fingertips
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-200 max-w-prose">
            Top brands, trending categories, and the latest products — all in
            one place. Browse deals, compare specs, and find the perfect gadget
            for your needs.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 items-center mt-4">
            <Button
              className="shadow-lg hover:bg-primary/90 transition"
              size="lg"
            >
              Shop Now
            </Button>

            <Button
              variant="outline"
              className="shadow-sm border-gray-300 dark:border-slate-700 dark:text-slate-200 transition"
              size="lg"
            >
              Explore Deals
            </Button>

            {/* Search - visible only on medium+ screens */}
            <div className="ml-2 hidden md:inline-block">
              <form className="flex items-center bg-gray-100 dark:bg-white/5 rounded-md p-1 pr-2">
                <Input
                  aria-label="search"
                  placeholder="Search products, brands or types"
                  className="bg-transparent placeholder:text-gray-400 dark:placeholder:text-slate-300 text-gray-900 dark:text-white"
                />
                <Button type="submit" size="sm" className="ml-2">
                  Search
                </Button>
              </form>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-4">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
              Free delivery over $99
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
              30-day returns
            </Badge>
          </div>
        </div>

        {/* Right Section - Hero Illustration */}
        <div className="hidden md:block">
          <div
            className="relative w-full h-64 rounded-xl overflow-hidden shadow-xl
      bg-gradient-to-tr from-gray-200 to-gray-300
      dark:from-slate-600 dark:to-slate-800 transition-colors duration-300"
          >
            <div className="absolute bottom-4 left-4 p-3 bg-white/80 dark:bg-black/30 rounded-md backdrop-blur">
              <div className="text-xs text-gray-600 dark:text-slate-100">
                Featured
              </div>
              <div className="text-sm font-semibold dark:text-white">
                Zetutech Exclusive Deals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP CATEGORIES */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOP_CATEGORIES.map((c: Category) => (
            <Card
              key={c.id}
              className="hover:shadow-lg p-0 transition-shadow group cursor-pointer overflow-hidden"
            >
              <CardContent className="p-0 aspect-square relative">
                <Image
                  src={c.image}
                  alt={`${c.name} category`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 backdrop-blur-sm">
                  <div className="font-semibold text-sm mb-1">{c.name}</div>
                  <div className="text-xs text-slate-200">{c.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* TOP PRODUCT TYPES */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Top Product Types</h2>
          <Button variant="ghost" size="sm">
            Browse All Types
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOP_PRODUCT_TYPES.map((t: ProductType) => (
            <Card
              key={t.id}
              className="relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform h-48"
            >
              <CardContent className="p-0 h-full">
                {/* Background Image */}
                <Image
                  src={t.image}
                  alt={`${t.name} products`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-between items-start">
                    <Badge className="bg-red-600/70 text-white backdrop-blur-sm border-0">
                      {t.tag}
                    </Badge>
                  </div>
                  <div className="text-white">
                    <div className="text-sm font-semibold mb-1">{t.name}</div>
                    <div className="text-xs text-slate-200 mb-2">
                      Hand-picked models and top sellers
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full text-gray-50 bg-black/60 hover:bg-black/80"
                    >
                      See Products
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* PROMOTION STRIP */}
      <div className="mt-8">
        <Card className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
            {/* Animated gradient orbs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce-slow"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-blue-300/15 to-pink-300/15 rounded-full blur-lg animate-spin-slow"></div>
          </div>

          {/* Moving gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

          {/* Content */}
          <CardContent className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 backdrop-blur-sm">
            <div className="py-2">
              <div className="text-sm font-semibold text-gray-500 dark:text-slate-300">
                Limited Time: Up to 30% off selected accessories
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-400">
                Offer valid while stocks last. Terms apply.
              </div>
            </div>
            <div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Shop Accessories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
