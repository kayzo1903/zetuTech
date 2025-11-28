export type ProductFormData = {
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categories: string[];
  status: string;
  isNew: boolean;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  display: string;
  warranty: string;
  specs: string[];
  images: Array<{
    file?: File;
    preview: string;
  }>;
};

//convert rawdata to formdata

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.category) searchParams.append("category", params.category);
  if (params?.search) searchParams.append("search", params.search);

  const response = await fetch(`/api/products?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
