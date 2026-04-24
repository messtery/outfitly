import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Product = {
  id: number
  name: string
  category: string
  price: number
}

const initialProducts: Product[] = [
  { id: 1, name: "Nasi Goreng", category: "Food", price: 15000 },
  { id: 2, name: "Es Teh", category: "Drink", price: 5000 },
]
const categoryOptions = ["Food", "Drink"] as const

export default function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const nextProductId = useRef(
    initialProducts.length
      ? Math.max(...initialProducts.map((product) => product.id)) + 1
      : 1,
  )
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const resetForm = () => {
    setName("")
    setCategory("")
    setPrice("")
    setEditingProductId(null)
    setErrorMessage("")
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedPrice = Number(price)

    if (
      !name.trim() ||
      !category.trim() ||
      Number.isNaN(parsedPrice) ||
      parsedPrice <= 0
    ) {
      setErrorMessage("Please fill all fields and use a price greater than 0.")
      return
    }

    if (editingProductId === null) {
      setProducts((prev) => [
        ...prev,
        {
          id: nextProductId.current,
          name: name.trim(),
          category: category.trim(),
          price: parsedPrice,
        },
      ])
      nextProductId.current += 1
      resetForm()
      return
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProductId
          ? {
              ...product,
              name: name.trim(),
              category: category.trim(),
              price: parsedPrice,
            }
          : product,
      ),
    )
    resetForm()
  }

  const handleEdit = (product: Product) => {
    setName(product.name)
    setCategory(product.category)
    setPrice(String(product.price))
    setEditingProductId(product.id)
  }

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
    if (editingProductId === id) {
      resetForm()
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Manage your data</CardDescription>
          </CardHeader>
          <CardContent>
            <nav aria-label="Admin sidebar" className="space-y-2">
              <Button asChild variant="secondary" className="w-full justify-start">
                <a href="/admin/products" aria-current="page">
                  Products
                </a>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <a href="/admin/categories">Categories</a>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <a href="/admin/orders">Orders</a>
              </Button>
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Create, update, and delete products.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="product-name">Name</Label>
                  <Input
                    id="product-name"
                    aria-label="Product name"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-category">Category</Label>
                  <select
                    id="product-category"
                    aria-label="Product category"
                    className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-price">Price</Label>
                  <Input
                    id="product-price"
                    aria-label="Product price"
                    placeholder="Price"
                    type="number"
                    min="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit">
                    {editingProductId === null ? "Create" : "Update"}
                  </Button>
                  {editingProductId !== null ? (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </form>
              {errorMessage ? (
                <p className="mt-3 text-sm text-destructive" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">#</th>
                    <th className="p-2 font-medium">Name</th>
                    <th className="p-2 font-medium">Category</th>
                    <th className="p-2 font-medium">Price</th>
                    <th className="p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="border-b last:border-b-0">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2">Rp {product.price.toLocaleString("id-ID")}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
