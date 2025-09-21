import AllProducts from "@/components/admin/admin-product-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div>
      <div className="px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-xl">Manage your product inventory</p>
        </div>
        <Link href="/products/add" className="flex items-center px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-blue-300 transition">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
        </Link>
      </div>
      <div>
        <AllProducts />
      </div>
    </div>
  );
}