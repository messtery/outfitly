import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { useNavigate } from "react-router-dom"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function CartItemSkeleton() {
  return (
    <div className="flex gap-3 items-center animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-muted shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded-full w-2/3" />
        <div className="h-3 bg-muted rounded-full w-1/3" />
      </div>
      <div className="w-24 h-8 bg-muted rounded-xl shrink-0" />
    </div>
  )
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchCartItems = () => {
    fetch("http://localhost:3000/api/cart-items", {
      headers: { Authorization: `Bearer ${localStorage.token}` },
    })
      .then((res) => res.json())
      .then((res) => setCartItems(res.data))
      .finally(() => setLoading(false))
  }

  const updateQty = (id, qty) => {
    setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, qty } : item))
    fetch("http://localhost:3000/api/cart-items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ customerId: 1, id, qty }),
    }).then(() => fetchCartItems())
  }

  const removeItem = (id) => {
    fetch(`http://localhost:3000/api/cart-items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.token}` },
    }).then(() => fetchCartItems())
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="rounded-2xl border bg-card px-4 py-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <CartItemSkeleton />
              {i < 3 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        <div className="rounded-2xl border bg-card h-48 animate-pulse" />
      </div>
    )
  }

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mt-1">Add items from the menu to get started</p>
        </div>
        <Button onClick={() => navigate("/menu")}>Browse Menu</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
      {/* Left: items */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Items</p>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>
        <Separator />
        <div className="px-4 py-3 space-y-4">
          {cartItems.map((item, idx) => (
            <div key={item.id}>
              <div className="flex gap-3 items-start">
                <img
                  src={item.product.image || "/placeholder-product.svg"}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(item.price)} each</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center rounded-xl border overflow-hidden">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                        onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeItem(item.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{formatCurrency(item.price * item.qty)}</span>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {idx < cartItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Right: summary */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Order Summary</p>
        </div>
        <Separator />
        <div className="px-4 pt-3 pb-4 space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
              <span className="line-clamp-1 flex-1 mr-2">{item.qty}× {item.product.name}</span>
              <span className="shrink-0">{formatCurrency(item.price * item.qty)}</span>
            </div>
          ))}
          <Separator className="my-1" />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
