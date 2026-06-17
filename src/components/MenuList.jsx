"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { cartService } from "../services/CartService"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "../hooks/useDebounce"
import { Search, ShoppingCart, UtensilsCrossed } from "lucide-react"

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-full" />
        <div className="h-3 bg-muted rounded-full w-1/2" />
        <div className="h-8 bg-muted rounded-xl w-full mt-3" />
      </div>
    </div>
  )
}

export default function MenuList() {
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    fetch("http://localhost:3000/api/categories?limit=50")
      .then((res) => res.json())
      .then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams({ limit: "100" })
    if (debouncedSearch) params.set("q", debouncedSearch)
    if (selectedCategoryId !== null) params.set("categoryId", selectedCategoryId)

    setLoading(true)
    fetch(`http://localhost:3000/api/products?${params}`)
      .then((res) => res.json())
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [debouncedSearch, selectedCategoryId])

  const handleAddToCart = (productId) => {
    cartService.addToCart(productId).then(() => {
      toast.success("Item added to cart", {
        description: "Check your cart for more details",
        action: { label: "View Cart", onClick: () => navigate("/cart") },
      })
    })
  }

  return (
    <div className="px-4 py-4 pb-10">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selectedCategoryId === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategoryId === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* States */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : !products.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No items found</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl border bg-card overflow-hidden flex flex-col">
              <img
                src={product.image || "/placeholder-product.svg"}
                alt={product.name}
                className="aspect-video w-full object-cover"
              />
              <div className="p-3 flex flex-col flex-1 gap-1.5">
                <div className="flex-1">
                  <p className="font-bold text-sm leading-snug line-clamp-1">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>
                <p className="text-sm font-bold text-primary mt-1">{formatCurrency(product.price)}</p>
                <Button
                  size="sm"
                  className="w-full text-xs rounded-xl mt-0.5"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
