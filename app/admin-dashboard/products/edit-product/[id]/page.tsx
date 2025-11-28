//app/admin-dashboard/products/edit-product/%5Bid%5D/page.tsx
import EditProduct from "@/components/admin/admin-edit-page";
type Params = Promise<{ id: string }>;

export default async function EditProductsPage(props: { params: Params }) {
  const params = await props.params;
  const productId = params.id;

  return (
    <main className="w-full">
      <EditProduct productId={productId} />
    </main>
  );
}
