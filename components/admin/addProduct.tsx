"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UploadMessage, UploadImageWrn } from "./uploadFileMessages";
import { laptopProductSchema } from "@/lib/validation-schemas/products";
import { LAPTOP_CATEGORIES, PRODUCT_STATUS } from "@/lib/validation-schemas/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ProductFormValues = z.infer<typeof laptopProductSchema>;



export default function AddProductForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(laptopProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      categories: [],
      status: "Brand New",
      isNew: false,
      processor: "",
      ram: "",
      storage: "",
      graphics: "",
      display: "",
      warranty: "",
      specs: [],
      images: [],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    console.log("Submitting Product:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Add New Laptop
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Fill in the details of your new laptop product
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ==================== Basic Information ==================== */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dell XPS 13" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dell" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. XPS 13 9310" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ Categories (Multi-Select) */}
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          if (!field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select one or more categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {LAPTOP_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg flex items-center gap-1"
                          >
                            {cat}
                            <button
                              type="button"
                              className="ml-1 text-red-500 hover:text-red-700"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((c) => c !== cat)
                                )
                              }
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ✅ Product Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product status" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ==================== Pricing & Stock ==================== */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6">Pricing & Stock</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (TZS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 1500000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Original Price */}
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (TZS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 1800000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Product Switch */}
              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Product</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ==================== Images Upload ==================== */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6">Product Images</h3>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Drag & Drop Area */}
                      <label
                        htmlFor="image-upload"
                        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all
                          ${
                            field.value?.length >= 5 ? (
                              <UploadImageWrn />
                            ) : (
                              <UploadMessage />
                            )
                          }`}
                      >
                        <p className="text-gray-500">
                          {field.value?.length >= 5 ? (
                            <UploadImageWrn />
                          ) : (
                            <UploadMessage />
                          )}
                        </p>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          disabled={field.value?.length >= 5}
                          onChange={(e) => {
                            if (!e.target.files) return;
                            const files = Array.from(e.target.files);
                            const newImages = files.map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));

                            const updated = [...field.value, ...newImages];
                            if (updated.length > 5) {
                              form.setError("images", {
                                type: "manual",
                                message: "Maximum 5 images allowed",
                              });
                              return;
                            }
                            field.onChange(updated);
                          }}
                        />
                      </label>

                      {/* Previews */}
                      {field.value?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          {field.value.map((image, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={image.preview}
                                alt={`Preview ${index + 1}`}
                                width={150}
                                height={150}
                                className="rounded-md object-cover w-full h-28"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...field.value];
                                  updated.splice(index, 1);
                                  field.onChange(updated);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ==================== Additional Specifications ==================== */}
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6">Specifications</h3>
            <FormField
              control={form.control}
              name="specs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      style={{ height: 120 }}
                      placeholder={`e.g.\nWindows 11 Home\nBacklit Keyboard\nThunderbolt 4`}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split("\n")
                            .map((spec) => spec.trim())
                            .filter((spec) => spec)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
