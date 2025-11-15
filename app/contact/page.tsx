import Contacts from "@/components/contact";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact zetuTech - Get in Touch for Laptops & Tech Support in Tanzania",
  description: "Reach zetuTech via phone, email, WhatsApp, or visit our Dar es Salaam location. Get support for laptops, electronics, and technical assistance in Tanzania.",
  keywords: [
    "contact zetuTech",
    "Tanzania laptop store contact",
    "Dar es Salaam computer shop",
    "zetuTech phone number",
    "tech support Tanzania",
    "laptop dealer contact",
    "WhatsApp support Tanzania",
    "Kariakoo electronics store",
    "computer repair Tanzania",
    "electronics support Dar es Salaam"
  ],
  openGraph: {
    title: "Contact zetuTech - Get in Touch for Laptops & Tech Support in Tanzania",
    description: "Contact zetuTech for quality laptops, electronics, and technical support in Dar es Salaam. Call, email, WhatsApp, or visit our Kariakoo location.",
    url: "https://zetutech.com/contact",
    siteName: "zetuTech",
    type: "website",
    images: [
      {
        url: "/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact zetuTech - Laptop & Electronics Store in Tanzania",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact zetuTech - Get in Touch for Laptops & Tech Support in Tanzania",
    description: "Reach zetuTech via phone, email, WhatsApp, or visit our Dar es Salaam location for laptops and tech support.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://zetutech.com/contact",
  },
};

export default function ContactsPage() {
  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900">
      <Contacts />
    </main>
  );
}
