import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent } from "./ui/card"

export default function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  
  const fetchCartItems = () => {
    fetch('http://localhost:3000/cart-items?customerId=1')
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
    <div className="min-h-[500px] flex items-center">
      <Card className="max-w-2xl w-full flex flex-col justify-between">
        <CardHeader>
          <h2 className="text-xl font-bold">Checkout</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <ul className="space-y-2">
              {cartItems.map((cartItem) => (
                <ul key={cartItem.id} className="flex justify-between">
                  <span>{cartItem.qty} {cartItem.product.name}</span>
                  <span>Rp {cartItem.price * cartItem.qty}</span>
                </ul>
              ))}
            </ul>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {total}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}