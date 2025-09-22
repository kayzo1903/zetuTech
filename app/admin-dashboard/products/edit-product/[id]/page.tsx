type Params = Promise<{ slug: string }>;

export default async function EditProductsPage(props: { params: Params }) {
  const params = await props.params;
  const productId = params.slug;
  console.log(productId);
  

  return <div>Edit</div>;
}
