// components/Hero/Hero.tsx

import FeaturedDeal from "../featuredeal";
import HeroCategories from "./herocategories";
import HeroPromo from "./HeroPromo";
import HorizontalCategories from "./horizontalcategories";



export default function Hero() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <HeroCategories />
          <FeaturedDeal />
          <HeroPromo />
        </div>
        <HorizontalCategories />
      </div>
    </div>
  );
}
