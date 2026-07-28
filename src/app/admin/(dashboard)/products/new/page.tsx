import AdminProductForm from "@/components/AdminProductForm"

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-primary-dark">Add Product</h1>
      <p className="mt-2 text-muted">Add a new product to your catalog.</p>
      <div className="mt-8">
        <AdminProductForm />
      </div>
    </div>
  )
}