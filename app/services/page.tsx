import ServicesPageContent from "@/components/services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - zetuTech | Innovation & AI Tech Agency",
  description: "Explore our core services: AI Integration, Web Application Development, and Network Architecture. Discover our proprietary Tzdraft Board Game.",
  keywords: [
    "zetuTech services",
    "AI integration Tanzania",
    "Web applications Dar es Salaam",
    "Network architecture",
    "Tzdraft board game",
    "digital solutions",
  ],
  openGraph: {
    title: "Services - zetuTech | Innovation & AI Tech Agency",
    description: "Explore our core services and our proprietary Tzdraft Board Game.",
    url: "https://zetutech.com/services",
    siteName: "zetuTech",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesPageContent />
    </main>
  );
}
