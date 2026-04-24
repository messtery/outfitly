import { useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./ui/table"

// const initialCart = [
//   { id: 1, name: "Nasi Goreng", category: "Makanan", price: 15000, qty: 1, image: "/images/nasi-goreng.jpg" },
//   { id: 2, name: "Es Teh", category: "Minuman", price: 5000, qty: 2, image: "/images/es-teh.jpg" },
//   { id: 3, name: "Ayam Geprek", category: "Makanan", price: 18000, qty: 1, image: "/images/ayam-geprek.jpg" },
// ]

export default function Cart({ cart, setCart }) {
//   const [cart, setCart] = useState(initialCart)

  const updateQty = (id, newQty) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    )
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
  const total = subtotal

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <h2 className="text-xl font-bold">Shopping Cart</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map(item => (
              <TableRow key={item.id}>
                <TableCell className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                  <div>
                    <span className="block">{item.name}</span>
                    {/* Label kategori */}
                    <span className="text-xs text-gray-400">{item.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell>Rp {item.price * item.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {subtotal}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {total}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="bg-black text-white">Confirm Order</Button>
      </CardFooter>
    </Card>
  )
}
