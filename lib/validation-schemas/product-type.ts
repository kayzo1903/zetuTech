export const PRODUCT_TYPES = [
  { id: "laptop", label: "Laptop" },
  { id: "desktop", label: "Desktop" },
  { id: "keyboard", label: "Keyboard" },
  { id: "mouse", label: "Mouse" },
  { id: "monitor", label: "Monitor" },
  { id: "accessory", label: "Accessory" },
];

// Categories per product type
export const PRODUCT_CATEGORIES = {
  laptop: [
    "Ultrabooks",
  "Gaming Laptops",
  "Business Laptops",
  "Budget Laptops",
  "2-in-1 Convertibles",
  "Chromebooks",
  "Workstation Laptops",
  "Student Laptops",
  "Creative/Design Laptops",
  "Thin and Light Laptops",
  "MacBooks",
  "Gaming Ultrabooks",
  "Rugged Laptops",
  "Netbooks",
  "Refurbished Laptops",
  ],
  desktop: [
    "Gaming Desktops",
    "Workstation PCs",
    "All-in-One PCs",
    "Mini PCs",
  ],
  keyboard: [
    "Mechanical Keyboards",
    "Membrane Keyboards",
    "Wireless Keyboards",
    "Gaming Keyboards",
  ],
  mouse: [
    "Gaming Mice",
    "Wireless Mice",
    "Ergonomic Mice",
    "Trackballs",
  ],
  monitor: [
    "Gaming Monitors",
    "Professional Monitors",
    "Portable Monitors",
  ],
  accessory: [
    "Cables & Adapters",
    "Headsets",
    "Webcams",
    "Speakers",
  ],
};

export const PRODUCT_STATUS = [
  "Brand New",
  "Refurbished",
  "Used-Like New",
  "Used-Good",
  "Used-Fair",
];