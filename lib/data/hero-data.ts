// Types
export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface Category {
  id: string;
  name: string;
  desc: string;
  image: string;
}

export interface ProductType {
  id: string;
  name: string;
  tag: string;
  image : string;
}

// Dummy Data
export const TOP_BRANDS: Brand[] = [
  { id: "apple", name: "apple", logo: "/images/brands/Apple.png" },
  { id: "samsung", name: "Samsung", logo: "/images/brands/samsung.png" },
  { id: "hp", name: "hp", logo: "/images/brands/hp.png" },
  { id: "dell", name: "Dell", logo: "/images/brands/Dell.png" },
  { id: "sony", name: "Sony", logo: "/images/brands/sony.jpg" },
  { id: "lenovo", name: "lenovo", logo: "/images/brands/lenovo.png" },
  { id: "google", name: "google", logo: "/images/brands/google.jpg" },
];

export const TOP_CATEGORIES: Category[] = [
  {
    id: "laptops",
    name: "Laptops",
    desc: "Powerful portable machines",
    image: "/images/categories/laptops.jpg",
  },
  {
    id: "phones",
    name: "Smartphones",
    desc: "Latest handsets & accessories",
    image: "/images/categories/smartphone.jpg",
  },
  {
    id: "audio",
    name: "Audio",
    desc: "Earbuds, headphones & speakers",
    image: "/images/categories/ear_bugs.jpg",
  },
  {
    id: "home",
    name: "Home Electronics",
    desc: "TVs, smart home & more",
    image: "/images/categories/homeelectronics.jpg",
  },
];

export const TOP_PRODUCT_TYPES: ProductType[] = [
  { id: "gaming-laptops", name: "Gaming Laptops", tag: "Hot" ,  image: "/images/product_type/gaming_laptops.jpg"},
  { id: "wireless-earbuds", name: "Wireless Earbuds", tag: "Trending" , image: "/images/product_type/headphones.jpg" },
  { id: "smart-watches", name: "Smart Watches", tag: "New" , image: "/images/product_type/smartwatch.jpg" },
  { id: "4k-tvs", name: "4K TVs", tag: "Top Pick" , image: "/images/product_type/4ktv.jpg" },
];
