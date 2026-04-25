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

type Category = {
  id: number
  name: string
  totalProducts: number
}

const initialCategories: Category[] = [
  { id: 1, name: "Food", totalProducts: 1 },
  { id: 2, name: "Drink", totalProducts: 1 },
]

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const nextCategoryId = useRef(
    initialCategories.length
      ? Math.max(...initialCategories.map((c) => c.id)) + 1
      : 1,
  )
  const [name, setName] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const resetForm = () => {
    setName("")
    setEditingCategoryId(null)
    setErrorMessage("")
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setErrorMessage("Please enter a category name.")
      return
    }

    if (editingCategoryId === null) {
      setCategories((prev) => [
        ...prev,
        {
          id: nextCategoryId.current,
          name: name.trim(),
          totalProducts: 0,
        },
      ])
      nextCategoryId.current += 1
      resetForm()
      return
    }

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategoryId ? { ...c, name: name.trim() } : c,
      ),
    )
    resetForm()
  }

  const handleEdit = (category: Category) => {
    setName(category.name)
    setEditingCategoryId(category.id)
    setErrorMessage("")
  }

  const handleDelete = (id: number) => {
    const category = categories.find((c) => c.id === id)
    if (category && category.totalProducts > 0) {
      setErrorMessage(
        `Cannot delete "${category.name}" because it has ${category.totalProducts} associated product(s).`,
      )
      return
    }
    setCategories((prev) => prev.filter((c) => c.id !== id))
    if (editingCategoryId === id) {
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
              <Button asChild variant="ghost" className="w-full justify-start">
                <a href="/admin/products">Products</a>
              </Button>
              <Button asChild variant="secondary" className="w-full justify-start">
                <a href="/admin/categories" aria-current="page">
                  Categories
                </a>
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
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Create, update, and delete categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="category-name">Name</Label>
                  <Input
                    id="category-name"
                    aria-label="Category name"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button type="submit">
                    {editingCategoryId === null ? "Create" : "Update"}
                  </Button>
                  {editingCategoryId !== null ? (
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
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">#</th>
                    <th className="p-2 font-medium">Name</th>
                    <th className="p-2 font-medium">Total Products</th>
                    <th className="p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className="border-b last:border-b-0">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{category.name}</td>
                      <td className="p-2">{category.totalProducts}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
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
