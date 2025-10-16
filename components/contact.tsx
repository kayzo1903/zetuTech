"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import AboutUs from "./aboutus";

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: ContactFormData) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: connect to backend or email service
  };

  // WhatsApp direct chat function
  const openWhatsApp = () => {
    const phoneNumber = "255712345678"; // Your WhatsApp business number
    const message =
      "Hello! I'm interested in your products and would like to get more information.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto  min-h-screen  py-12 px-6 sm:px-10">
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <Button
          onClick={openWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="sr-only">Chat on WhatsApp</span>
        </Button>

        {/* Optional: Tooltip on hover */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Chat with us on WhatsApp!
        </div>
      </div>

      <div className="mx-auto">
        {/* Page Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Us
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Have questions or need assistance? We&apos;re here to help! Get in
            touch with us via phone, email, WhatsApp, or the form below.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>

            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Address
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kariakoo, Dar es Salaam, Tanzania
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Phone
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    +255 712 345 678
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Email
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    support@muuzatech.com
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    Business Hours
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mon - Fri: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sat: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </li>

              {/* WhatsApp Quick Action */}
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 dark:text-white font-medium">
                    WhatsApp
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Quick chat support
                  </p>
                  <Button
                    onClick={openWhatsApp}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="mt-2"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="mt-2"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject of your message"
                  required
                  className="mt-2"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={4}
                  required
                  className="mt-2"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15840.035102001923!2d39.2783565!3d-6.8120136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b5bfa78d6c5%3A0xf94b1d4e2f2a0e7c!2sKariakoo!5e0!3m2!1sen!2stz!4v1632724083452!5m2!1sen!2stz"
            width="100%"
            height="400"
            allowFullScreen
            loading="lazy"
            className="border-0 w-full"
            title="Muuza Location Map"
          ></iframe>
        </div>
      </div>

      <div className="mx-auto">
        <AboutUs />
      </div>
    </div>
  );
}
