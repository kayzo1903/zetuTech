// components/Hero/HeroPromo.tsx

export default function HeroPromo() {
  return (
    <div className="lg:w-1/4">
      <div className="bg-gray-800 rounded-lg p-5 text-white h-full">
        <h3 className="font-bold text-lg mb-3">Tech Support Included</h3>
        <p className="text-sm text-gray-200 mb-4">
          Free setup and 3 months tech support with every purchase
        </p>
        <div className="bg-gray-900 rounded p-3 mb-4">
          <p className="text-xs text-gray-300">Special Offer</p>
          <p className="font-semibold">Get antivirus software FREE</p>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}
