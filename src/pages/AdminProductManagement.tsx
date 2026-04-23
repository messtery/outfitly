import { useState } from "react"

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

export default function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [editingProductId, setEditingProductId] = useState<number | null>(null)

  const resetForm = () => {
    setName("")
    setCategory("")
    setPrice("")
    setEditingProductId(null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedPrice = Number(price)

    if (!name.trim() || !category.trim() || Number.isNaN(parsedPrice)) {
      return
    }

    if (editingProductId === null) {
      setProducts((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((product) => product.id)) + 1 : 1,
          name: name.trim(),
          category: category.trim(),
          price: parsedPrice,
        },
      ])
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
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Product Management</h1>

      <form onSubmit={handleSubmit} className="mb-8 grid gap-3 md:grid-cols-4">
        <input
          className="rounded border p-2"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Price"
          type="number"
          min="0"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white hover:cursor-pointer"
          >
            {editingProductId === null ? "Create" : "Update"}
          </button>
          {editingProductId !== null ? (
            <button
              type="button"
              className="rounded border px-4 py-2 hover:cursor-pointer"
              onClick={resetForm}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">{product.price}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded border px-3 py-1 hover:cursor-pointer"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded border px-3 py-1 hover:cursor-pointer"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
