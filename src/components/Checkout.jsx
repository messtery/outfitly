import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function Checkout({}) {
    const initialCart = [
    { id: 1, name: "Nasi Goreng", category: "Makanan", price: 15000, qty: 1, image: "/images/nasi-goreng.jpg" },
    { id: 2, name: "Es Teh", category: "Minuman", price: 5000, qty: 2, image: "/images/es-teh.jpg" },
    { id: 3, name: "Ayam Geprek", category: "Makanan", price: 18000, qty: 1, image: "/images/ayam-geprek.jpg" },
  ]
  const subtotal = initialCart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const total = subtotal

  return (
    <div className="min-h-[500px] flex items-center">
      <Card className="max-w-2xl w-full flex flex-col justify-between text-white">
        <CardHeader>
          <h2 className="text-xl font-bold">Checkout</h2>
        </CardHeader>
        <CardContent className="space-y-4">

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <ul className="space-y-2">
              {initialCart.map(item => (
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
    </div>
  )
}
