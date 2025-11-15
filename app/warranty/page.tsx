import { Metadata } from "next";
import WarrantyPage from "./warrantpage";

export const metadata: Metadata = {
  title: "Warranty & Product Protection | zetuTech",
  description:
    "Learn more about zetuTech's 1-year warranty, product protection details, and how to claim warranty services for laptops, desktops, and electronics.",
  keywords: [
    "Warranty",
    "Product Warranty",
    "Electronics Warranty",
    "zetuTech Warranty",
    "Laptop Warranty Tanzania",
    "Tech Warranty Services",
  ],
  openGraph: {
    title: "Warranty & Product Protection | zetuTech",
    description:
      "Get full details on zetuTech's warranty coverage, claims process, and repair assistance.",
    url: "https://zetutech.com/warranty",
    siteName: "zetuTech",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warranty & Product Protection | zetuTech",
    description:
      "Find out how to access warranty services, repair coverage, and product protection at zetuTech.",
  },
};

export default function Page() {
  return (
    <main>
      <WarrantyPage />
    </main>
  );
}
