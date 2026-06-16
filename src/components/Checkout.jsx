import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent } from "./ui/card"
import { Separator } from "./ui/separator"

export default function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  const fetchCartItems = () => {
    fetch('http://localhost:3000/api/cart-items?customerId=1', {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCartItems(res.data)
        setTotal(res.data.reduce((sum, item) => sum + (item.price * item.qty), 0))
      })
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <p className="text-sm text-muted-foreground">{cartItems.length} item(s)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {cartItems.map((cartItem) => (
            <li key={cartItem.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold">
                  {cartItem.qty}
                </span>
                <span className="text-sm">{cartItem.product.name}</span>
              </div>
              <span className="text-sm font-medium">Rp {(cartItem.price * cartItem.qty).toLocaleString()}</span>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
