import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function Checkout({ cart=[] }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const total = subtotal

  return (
    <Card className="max-w-2xl mx-auto mt-10 text-white">
      <CardHeader>
        <h2 className="text-xl font-bold">Checkout</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <ul className="space-y-2">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.qty}</span>
                <span>Rp {item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {subtotal}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rp {total}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button className="bg-black text-white">Confirm Order</Button>
      </CardFooter>
    </Card>
  )
}
