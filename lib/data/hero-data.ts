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
  link: string;
}

export interface ProductType {
  id: string;
  name: string;
  tag: string;
  image: string;
  link: string;
} 

export const TOP_CATEGORIES: Category[] = [
  {
    id: "laptops",
    name: "Laptops",
    desc: "Powerful portable machines",
    image: "/images/categories/laptops.jpg",
    link: "/products?type=laptop"
  },
  {
    id: "phones",
    name: "Smartphones",
    desc: "Latest handsets & accessories",
    image: "/images/categories/smartphone.jpg",
    link: "/products?type=smartphone"
  },
  {
    id: "audio",
    name: "Audio",
    desc: "Earbuds, headphones & speakers",
    image: "/images/categories/ear_bugs.jpg",
    link: "/products?type=audio"
  },
  {
    id: "home",
    name: "Home Electronics",
    desc: "TVs, smart home & more",
    image: "/images/categories/homeelectronics.jpg",
    link: "/products?type=home-electronics"
  },
];

export const TOP_PRODUCT_TYPES: ProductType[] = [
  { 
    id: "gaming-laptops", 
    name: "Gaming Laptops", 
    tag: "Hot",  
    image: "/images/product_type/gaming_laptops.jpg",
    link: "/products?category=laptops&type=Gaming Laptops" 
  },
  { 
    id: "wireless-earbuds", 
    name: "Wireless Earbuds", 
    tag: "Trending", 
    image: "/images/product_type/headphones.jpg", 
    link: "/products?category=audio&type=wireless" 
  },
  { 
    id: "smart-watches", 
    name: "Smart Watches", 
    tag: "New", 
    image: "/images/product_type/smartwatch.jpg", 
    link: "/products?category=wearables&type=smart-watches" 
  },
  { 
    id: "4k-tvs", 
    name: "4K TVs", 
    tag: "Top Pick", 
    image: "/images/product_type/4ktv.jpg", 
    link: "/products?type=tv" 
  },
];