import AboutUs from "@/components/aboutus";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About zetuTech - Innovation & AI Tech Agency",
  description: "Learn about zetuTech's mission to utilize AI and innovation to create digital products that improve living standards in Tanzania and beyond.",
  keywords: [
    "About zetuTech",
    "Tanzania AI agency",
    "tech innovation Tanzania",
    "digital solutions Dar es Salaam",
    "AI products Tanzania",
    "zetuTech mission",
    "future of technology",
    "smart solutions",
  ],
  openGraph: {
    title: "About zetuTech - Innovation & AI Tech Agency",
    description: "Discover zetuTech's journey, mission, and values. Your partner for next-generation tech solutions.",
    url: "https://zetutech.com/about",
    siteName: "zetuTech",
    type: "website",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About zetuTech - Innovation and Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About zetuTech - Innovation & AI Tech Agency",
    description: "Learn about our mission to provide next-generation AI and tech solutions.",
  },
};


export default function AboutPage() {
  return (
    <main>
      <AboutUs />
    </main>
  );
}
