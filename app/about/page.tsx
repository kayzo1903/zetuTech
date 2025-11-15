import AboutUs from "@/components/aboutus";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About zetuTech - Tanzania's Trusted Laptop & Electronics Provider",
  description: "Learn about zetuTech's mission to provide quality laptops, excellent service, and tech solutions in Tanzania. Discover our story, values, and commitment to customers.",
  keywords: [
    "About zetuTech",
    "Tanzania laptop store",
    "tech company Tanzania",
    "computer store Dar es Salaam",
    "laptop dealer Tanzania",
    "zetuTech mission",
    "Tanzania electronics",
    "quality laptops Tanzania",
    "tech solutions Tanzania",
    "computer warranty Tanzania"
  ],
  openGraph: {
    title: "About zetuTech - Tanzania's Trusted Laptop & Electronics Provider",
    description: "Discover zetuTech's journey, mission, and values. Your trusted partner for quality laptops and tech solutions in Tanzania since 2020.",
    url: "https://zetutech.com/about",
    siteName: "zetuTech",
    type: "website",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About zetuTech - Tanzania's Trusted Tech Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About zetuTech - Tanzania's Trusted Laptop & Electronics Provider",
    description: "Learn about our mission to provide quality laptops and exceptional service in Tanzania. Discover our story and values.",
  },
};


export default function AboutPage() {
  return (
    <main>
      <AboutUs />
    </main>
  );
}
