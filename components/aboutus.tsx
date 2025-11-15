"use client";
import { useState } from "react";


export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About zetuTech
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your trusted partner for quality laptops and exceptional service in Tanzania.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab("mission")}
            className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
              activeTab === "mission"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Our Mission
          </button>
          <button
            onClick={() => setActiveTab("story")}
            className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
              activeTab === "story"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Our Story
          </button>
          <button
            onClick={() => setActiveTab("values")}
            className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
              activeTab === "values"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-t border-l border-r border-gray-200 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Our Values
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          {/* Mission Content */}
          {activeTab === "mission" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    1
                  </span>
                  Our Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  At ZetuTech, our mission is to empower individuals and businesses in Tanzania with 
                  reliable, high-quality computing solutions that enhance productivity and enable growth.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">What We Do:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                        <span className="text-green-800 dark:text-green-300 font-medium">💻</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Quality Laptops</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">New and refurbished options</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mr-3">
                        <span className="text-purple-800 dark:text-purple-300 font-medium">🛡️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Warranty Protection</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Peace of mind guarantee</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg mr-3">
                        <span className="text-orange-800 dark:text-orange-300 font-medium">🚚</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Personal Delivery</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Across Dar es Salaam</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3">
                        <span className="text-red-800 dark:text-red-300 font-medium">💬</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Customer Support</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Dedicated assistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    2
                  </span>
                  Why Choose ZetuTech?
                </h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Carefully tested and verified laptops</li>
                  <li>Transparent pricing with no hidden costs</li>
                  <li>Local expertise with global standards</li>
                  <li>Personalized service tailored to your needs</li>
                  <li>Commitment to customer satisfaction</li>
                </ul>
              </section>
            </div>
          )}

          {/* Story Content */}
          {activeTab === "story" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    1
                  </span>
                  Our Beginning
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  ZetuTech was founded in 2020 with a simple vision: to provide Tanzanians with access 
                  to quality computing technology at affordable prices.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  What started as a small venture has grown into a trusted name in the Dar es Salaam 
                  tech community, serving hundreds of satisfied customers including students, professionals, 
                  and businesses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    2
                  </span>
                  Our Growth
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Over the years, we&apos;ve built strong relationships with suppliers and developed rigorous 
                  testing processes to ensure every laptop we sell meets our high standards. Our personal 
                  delivery service sets us apart, allowing us to build trust with our customers face-to-face.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    3
                  </span>
                  Our Future
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We&apos;re continuously expanding our product range and services to better serve the Tanzanian 
                  market. Our goal is to become the leading provider of computing solutions in the region, 
                  known for our reliability, quality, and exceptional customer service.
                </p>
              </section>
            </div>
          )}

          {/* Values Content */}
          {activeTab === "values" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    1
                  </span>
                  Core Values
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our values guide everything we do at zetuTech, from selecting products to serving our customers.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Integrity</h3>
                    <p className="text-green-700 dark:text-green-300">
                      We&apos;re honest about product conditions and transparent in our pricing. No surprises, just straight talk.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quality</h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      Every laptop undergoes rigorous testing. We stand behind our products with comprehensive warranties.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Customer Focus</h3>
                    <p className="text-purple-700 dark:text-purple-300">
                      We listen to your needs and provide personalized solutions. Your satisfaction is our priority.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Innovation</h3>
                    <p className="text-orange-700 dark:text-orange-300">
                      We continuously improve our processes and stay updated with the latest technology trends.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    2
                  </span>
                  Community Commitment
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  As a Tanzanian business, we&apos;re committed to supporting our local community. We provide 
                  employment opportunities, support educational initiatives, and contribute to the growth 
                  of the digital economy in Tanzania.
                </p>
              </section>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Get in Touch</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have questions or need assistance? We&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:info@zetutech.co.tz"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+255000000000"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}