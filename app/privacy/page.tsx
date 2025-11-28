// app/privacy/page.tsx
import PrivacyPolicyContent from "@/components/privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | zetuTech - Data Protection & Privacy Commitment",
  description: "Read zetuTech's Privacy Policy to understand how we collect, use, and protect your personal information when you use our services in Tanzania.",
  keywords: [
    "privacy policy",
    "data protection Tanzania",
    "zetuTech privacy",
    "personal information security",
    "Tanzania data privacy",
    "GDPR compliance Tanzania",
    "customer data protection",
    "privacy policy Tanzania",
    "data security",
    "information collection policy"
  ],
  openGraph: {
    title: "Privacy Policy | zetuTech - Data Protection & Privacy Commitment",
    description: "Learn how zetuTech protects your personal data and privacy when you shop for laptops and electronics in Tanzania.",
    url: "https://zetutech.com/privacy",
    siteName: "zetuTech",
    type: "website",
    images: [
      {
        url: "/og-privacy.jpg",
        width: 1200,
        height: 630,
        alt: "zetuTech Privacy Policy - Data Protection Commitment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | zetuTech - Data Protection & Privacy Commitment",
    description: "Understand how zetuTech handles your personal information and protects your privacy in Tanzania.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://zetutech.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            At ZetuTech, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          <PrivacyPolicyContent />
        </div>

        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}