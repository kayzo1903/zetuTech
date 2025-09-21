"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PRODUCT_CATEGORIES, PRODUCT_STATUS, PRODUCT_TYPES } from "@/lib/validation-schemas/product-type";
import { productSchema } from "@/lib/validation-schemas/products-schema";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type ProductTypeKey = keyof typeof PRODUCT_CATEGORIES;

export default function ProductForm() {
  const [productType, setProductType] = useState<ProductTypeKey | "">("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    stock: "",
    originalPrice: "",
    salePrice: "",
    warrantyPeriod: "",
    warrantyDetails: "",
    description: "",
    status: "Draft"
  });

  const router = useRouter();

  // When product type changes, load relevant categories
  const handleProductTypeChange = (type: string) => {
    setProductType(type as ProductTypeKey);
    setCategories(PRODUCT_CATEGORIES[type as ProductTypeKey] || []);
    setSelectedCategories([]);
    setErrors(prev => ({ ...prev, productType: "" }));
  };

  // Handle image selection
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    setErrors(prev => ({ ...prev, images: "" }));
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    try {
      const data = {
        productType,
        name: formData.name,
        brand: formData.brand,
        stock: parseInt(formData.stock) || 0,
        categories: selectedCategories,
        status: formData.status,
        description: formData.description,
        images: images.map(img => img.file),
        hasDiscount,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        salePrice: hasDiscount ? (parseFloat(formData.salePrice) || 0) : undefined,
        hasWarranty,
        warrantyPeriod: hasWarranty ? formData.warrantyPeriod : undefined,
        warrantyDetails: hasWarranty ? formData.warrantyDetails : undefined,
      };

      productSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path) {
            newErrors[String(err.path[0])] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // First validate the form
  if (!validateForm()) {
    return;
  }

  try {
    // Create FormData object for file uploads
    const formDataToSend = new FormData();
    
    // Append all form data
    formDataToSend.append('productType', productType);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('brand', formData.brand);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('categories', JSON.stringify(selectedCategories));
    formDataToSend.append('status', formData.status);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('hasDiscount', hasDiscount.toString());
    formDataToSend.append('originalPrice', formData.originalPrice);
    formDataToSend.append('hasWarranty', hasWarranty.toString());
    
    if (hasDiscount) {
      formDataToSend.append('salePrice', formData.salePrice);
    }
    
    if (hasWarranty) {
      formDataToSend.append('warrantyPeriod', formData.warrantyPeriod);
      formDataToSend.append('warrantyDetails', formData.warrantyDetails);
    }
    
    // Append image files
    images.forEach((image) => {
      formDataToSend.append('images', image.file);
    });

    const res = await fetch("/api/products", {
      method: "POST",
      body: formDataToSend, // Send as FormData, not JSON
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to create product");
      return;
    }

   // Show success toast
    toast(
      "Success",{
      description: "Product created successfully!",
    });

    // Redirect after a short delay (e.g., 1.5 seconds)
    setTimeout(() => {
      router.push("/dashboard/products"); // Redirect to product listing
    }, 1500);

  } catch  {
    toast.error("An unexpected error occurred");
  }
};

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Add New Product
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Fill in the details of the new product.
        </p>
      </div>

      {/* Product Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Type</label>
        <Select onValueChange={handleProductTypeChange}>
          <SelectTrigger className={errors.productType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType}</p>}
      </div>

      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <Input 
            name="name" 
            placeholder="e.g. Dell XPS 13" 
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Input 
            name="brand" 
            placeholder="e.g. Dell" 
            value={formData.brand}
            onChange={handleInputChange}
            className={errors.brand ? "border-red-500" : ""}
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <Input 
            name="stock" 
            type="number" 
            placeholder="e.g. 10" 
            value={formData.stock}
            onChange={handleInputChange}
            className={errors.stock ? "border-red-500" : ""}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {hasDiscount ? "Original Price (TZS)" : "Price (TZS)"}
            </label>
            <Input 
              name="originalPrice"
              type="number" 
              placeholder="e.g. 1500000" 
              value={formData.originalPrice}
              onChange={handleInputChange}
              className={errors.originalPrice ? "border-red-500" : ""}
            />
            {errors.originalPrice && <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>}
          </div>
          
          <div className="flex items-center space-x-2 pt-6">
            <Switch 
              id="discount-mode" 
              checked={hasDiscount}
              onCheckedChange={setHasDiscount}
            />
            <Label htmlFor="discount-mode">Enable discount</Label>
          </div>
        </div>
        
        {hasDiscount && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sale Price (TZS)</label>
              <Input 
                name="salePrice"
                type="number" 
                placeholder="e.g. 1200000" 
                value={formData.salePrice}
                onChange={handleInputChange}
                className={errors.salePrice ? "border-red-500" : ""}
              />
              {errors.salePrice && <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>}
              {formData.salePrice && formData.originalPrice && 
               parseFloat(formData.salePrice) >= parseFloat(formData.originalPrice) && (
                <p className="text-yellow-600 text-sm mt-1">
                  Sale price should be less than original price
                </p>
              )}
            </div>
            <div className="flex items-end">
              <p className="text-sm text-green-600 dark:text-green-400">
                Customers will see the discounted price
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Warranty Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="warranty" 
            checked={hasWarranty}
            onCheckedChange={setHasWarranty}
          />
          <Label htmlFor="warranty" className="text-lg font-semibold">Includes Warranty</Label>
        </div>
        
        {hasWarranty && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Warranty Period</label>
              <Select 
                value={formData.warrantyPeriod} 
                onValueChange={(value) => handleSelectChange("warrantyPeriod", value)}
              >
                <SelectTrigger className={errors.warrantyPeriod ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select warranty period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="730">2 years</SelectItem>
                  <SelectItem value="1095">3 years</SelectItem>
                </SelectContent>
              </Select>
              {errors.warrantyPeriod && <p className="text-red-500 text-sm mt-1">{errors.warrantyPeriod}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Warranty Details</label>
              <Input 
                name="warrantyDetails" 
                placeholder="e.g. Manufacturer warranty" 
                value={formData.warrantyDetails}
                onChange={handleInputChange}
                className={errors.warrantyDetails ? "border-red-500" : ""}
              />
              {errors.warrantyDetails && <p className="text-red-500 text-sm mt-1">{errors.warrantyDetails}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Categories */}
      {productType && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Categories ({productType})
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedCategories.includes(category)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                }`}
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    setSelectedCategories((prev) =>
                      prev.filter((c) => c !== category)
                    );
                  } else {
                    setSelectedCategories((prev) => [...prev, category]);
                  }
                  setErrors(prev => ({ ...prev, categories: "" }));
                }}
              >
                {category}
              </button>
            ))}
          </div>
          {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
          {selectedCategories.length === 0 && categories.length > 0 && (
            <p className="text-gray-500 text-sm mt-1">Select at least one category</p>
          )}
        </div>
      )}

      {/* Product Status */}
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_STATUS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea 
          name="description"
          placeholder="Write a detailed description of the product including all relevant features and specifications" 
          rows={6} 
          value={formData.description}
          onChange={handleInputChange}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

       {/* /* Image Upload */ }
        <div>
         <label className="block text-sm font-medium mb-2">Product Images</label>
         <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files)}
          className="block w-full border p-2 rounded"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image.preview}
                alt={`Product Image ${index + 1}`}
                width={150}
                height={150}
                className="object-cover w-full h-28 rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {images.length >= 5 && (
          <p className="text-red-500 text-sm mt-2">
            Maximum of 5 images allowed
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 text-white">
          Save Product
        </Button>
      </div>
    </form>
  );
}
   
