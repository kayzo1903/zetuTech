// app/dashboard/allproducts/page.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit, Trash2 , ImageIcon } from "lucide-react";
import Image from "next/image";

// Mock product data with images
const mockProducts = [
  {
    id: 1,
    name: "Dell XPS 13",
    brand: "Dell",
    productType: "Laptops",
    status: "Active",
    stock: 15,
    originalPrice: "1500000",
    salePrice: "1350000",
    hasDiscount: true,
    categories: ["Ultrabooks", "Business Laptops"],
    image: "/api/placeholder/80/80?text=Dell+XPS",
    createdAt: "2023-10-15",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    brand: "Apple",
    productType: "Smartphones",
    status: "Active",
    stock: 25,
    originalPrice: "2200000",
    salePrice: null,
    hasDiscount: false,
    categories: ["Flagship Phones", "iOS"],
    image: "/api/placeholder/80/80?text=iPhone+15",
    createdAt: "2023-11-20",
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    brand: "Samsung",
    productType: "Smartphones",
    status: "Out of Stock",
    stock: 0,
    originalPrice: "1800000",
    salePrice: "1600000",
    hasDiscount: true,
    categories: ["Android", "Flagship Phones"],
    image: "/api/placeholder/80/80?text=Galaxy+S23",
    createdAt: "2023-09-05",
  },
  {
    id: 4,
    name: "MacBook Air M2",
    brand: "Apple",
    productType: "Laptops",
    status: "Active",
    stock: 8,
    originalPrice: "2100000",
    salePrice: null,
    hasDiscount: false,
    categories: ["Ultrabooks", "Apple"],
    image: "/api/placeholder/80/80?text=MacBook+Air",
    createdAt: "2023-12-01",
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    productType: "Audio",
    status: "Draft",
    stock: 12,
    originalPrice: "650000",
    salePrice: "580000",
    hasDiscount: true,
    categories: ["Headphones", "Wireless"],
    image: "/api/placeholder/80/80?text=Sony+Headphones",
    createdAt: "2023-11-10",
  },
];

const PRODUCT_STATUS = {
  Draft: "bg-gray-100 text-gray-800",
  Active: "bg-green-100 text-green-800",
  "Out of Stock": "bg-red-100 text-red-800",
  Archived: "bg-yellow-100 text-yellow-800",
} as const;

export default function AllProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get all unique categories for filter
  const allCategories = Array.from(
    new Set(products.flatMap((product) => product.categories))
  );

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || 
                           product.categories.some(cat => cat === categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const formatPrice = (price: string | null) => {
    if (!price) return "-";
    return `TZS ${parseInt(price).toLocaleString()}`;
  };

  return (
    <div className="p-6"> 
      {/* Filters and Search */}
      <div className="rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No products found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16 relative rounded-md overflow-hidden border">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.categories.slice(0, 2).map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      {product.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {product.hasDiscount ? (
                        <>
                          <span className="text-green-600 font-semibold">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-gray-500 line-through text-sm">
                            {formatPrice(product.originalPrice)}
                          </span>
                        </>
                      ) : (
                        <span>{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock === 0
                          ? "text-red-600 font-semibold"
                          : product.stock < 10
                          ? "text-yellow-600 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={PRODUCT_STATUS[product.status as keyof typeof PRODUCT_STATUS]}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          // Handle edit - navigate to edit page
                          console.log("Edit product:", product.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the product &quot;{product.name}&quot; and remove it
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (optional) */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}