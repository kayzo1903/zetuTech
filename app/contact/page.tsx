import Contacts from "@/components/contact";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact zetuTech - Get in Touch",
  description: "Reach zetuTech to discuss AI integration, web applications, and digital solutions in Tanzania.",
  keywords: [
    "contact zetuTech",
    "Tanzania AI agency contact",
    "Dar es Salaam tech company",
    "zetuTech phone number",
    "tech support Tanzania",
    "digital solutions contact",
    "software agency Dar es Salaam"
  ],
  openGraph: {
    title: "Contact zetuTech - Get in Touch",
    description: "Contact zetuTech to discuss AI integration, web applications, and digital solutions in Tanzania.",
    url: "https://zetutech.com/contact",
    siteName: "zetuTech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact zetuTech - Get in Touch",
    description: "Reach zetuTech to discuss your next digital project.",
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
    <main className="w-full bg-black min-h-screen text-white">
      <Contacts />
    </main>
  );
}
