import type { Metadata } from "next";
import ShippingPage from "./shipping";


export const metadata: Metadata = {
  title: "Shipping Information | zetuTech - Fast & Reliable Delivery in Tanzania",
  description: "Get details about zetuTech's shipping options, delivery times, and costs across Tanzania. Free delivery in Dar es Salaam, affordable rates for other regions.",
  keywords: [
    "shipping information",
    "delivery Tanzania",
    "zetuTech shipping",
    "Dar es Salaam delivery",
    "Tanzania electronics delivery",
    "order tracking",
    "shipping costs Tanzania",
    "free delivery Dar es Salaam",
    "laptop delivery Tanzania",
    "tech products shipping"
  ],
  openGraph: {
    title: "Shipping Information | zetuTech - Fast & Reliable Delivery in Tanzania",
    description: "Learn about zetuTech's shipping options including free Dar es Salaam delivery, regional shipping, and order tracking across Tanzania.",
    url: "https://zetutech.com/shipping",
    siteName: "zetuTech",
    type: "website",
    images: [
      {
        url: "/og-shipping.jpg",
        width: 1200,
        height: 630,
        alt: "zetuTech Shipping Information - Fast Delivery Across Tanzania",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Information | zetuTech - Fast & Reliable Delivery in Tanzania",
    description: "Discover zetuTech's shipping options with free Dar es Salaam delivery and affordable rates across Tanzania.",
  },
};

export default function Shipping() {
  return <ShippingPage />;
}