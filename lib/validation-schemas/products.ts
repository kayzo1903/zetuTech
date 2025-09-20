import { z } from "zod";

// ✅ Schema with proper validation
export const laptopProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  originalPrice: z
    .number()
    .min(1, "Original price must be greater than 0")
    .optional(),

  stock: z.number().min(0, "Stock must be 0 or more"),

  categories: z
    .array(z.string().min(1, "Category is required"))
    .min(1, "Select at least one category"),
  status: z.enum([
    "Brand New", 
    "Refurbished", 
    "Used-Like New", 
    "Used-Good", 
    "Used-Fair"
  ]),
  isNew: z.boolean(),

  processor: z.string().min(1, "Processor is required"),
  ram: z.string().min(1, "RAM is required"),
  storage: z.string().min(1, "Storage is required"),
  graphics: z.string().min(1, "Graphics is required"),
  display: z.string().min(1, "Display is required"),
  warranty: z.string().min(1, "Warranty is required"),

  specs: z
    .array(z.string().min(1, "Each spec must be at least 1 character"))
    .min(1, "At least one spec is required"),

  images: z
    .array(
      z.object({
        file: z.instanceof(File).optional(),
        preview: z.string().url(),
      })
    )
    .min(1, "At least 1 image is required")
    .max(5, "Maximum 5 images allowed"),
});
