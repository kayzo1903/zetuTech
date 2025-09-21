import { z } from "zod";

export const productSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  name: z.string().min(1, "Product name is required").max(255, "Product name is too long"),
  brand: z.string().min(1, "Brand is required").max(100, "Brand name is too long"),
  stock: z.number().min(0, "Stock cannot be negative").int("Stock must be a whole number"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  status: z.enum(["Brand New", "Refurbished", "Archived", "Out of Stock"]),
  description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
  images: z.array(z.any()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
  hasDiscount: z.boolean().default(false),
  originalPrice: z.number().min(0, "Price cannot be negative"),
  salePrice: z.number().min(0, "Sale price cannot be negative").optional(),
  hasWarranty: z.boolean().default(false),
  warrantyPeriod: z.string().optional(),
  warrantyDetails: z.string().max(500, "Warranty details are too long").optional(),
}).refine((data) => {
  if (data.hasDiscount && data.salePrice !== undefined) {
    return data.salePrice < data.originalPrice;
  }
  return true;
}, {
  message: "Sale price must be less than original price",
  path: ["salePrice"],
}).refine((data) => {
  if (data.hasWarranty) {
    return data.warrantyPeriod !== undefined && data.warrantyPeriod !== "";
  }
  return true;
}, {
  message: "Warranty period is required when warranty is enabled",
  path: ["warrantyPeriod"],
});

export type ProductFormData = z.infer<typeof productSchema>;