import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { cartService } from "@/services/cartService"

export default function OrderActions({ mode = "tracking", onCancel, onRepeat, items = [] }) {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleRepeat = async () => {
    setLoading(true)
    try {
      await cartService.clearCart()
      await Promise.all(
        items.map((item) => cartService.addToCartWithQty(item.productId, item.qty))
      )
      if (onRepeat) onRepeat()
      navigate("/cart")
    } finally {
      setLoading(false)
    }
  }


  if (mode === "tracking") {
    return (
      <div className="flex gap-2">
        <Button variant="destructive" size="sm" onClick={onCancel}>
          Batalkan Pesanan
        </Button>
      </div>
    )
  }

  if (mode === "history") {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleRepeat} disabled={loading}>
          {loading ? "Loading..." : "Repeat Order"}
        </Button>
      </div>
    )
  }

  return null
}
