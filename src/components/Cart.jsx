import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./ui/table"
import { useNavigate } from "react-router-dom"

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const handleQtyUpdate = (id, qty) => {
    setCartItems((prevItems) => prevItems.map((item) => item.id === id ? { ...item, qty } : item))
    updateCartItem(id, qty)
  }

  const handleRemove = (id) => {
    deleteCartItem(id)
  }

  const fetchCartItems = () => {
    fetch('http://localhost:3000/cart-items', {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCartItems(res.data)
        setTotal(res.data.reduce((sum, item) => sum + (item.price * item.qty), 0))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const updateCartItem = (id, qty) => {
    fetch('http://localhost:3000/cart-items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        customerId: 1,
        id,
        qty,
      })
    })
      .then((res) => res.json())
      .then((res) => {
        fetchCartItems()
      })
  }

  const deleteCartItem = async (id) => {
    await fetch(`http://localhost:3000/cart-items/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
      },
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => {
        fetchCartItems()
      })
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  if (loading) {
    return (
      <>
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </>
    )
  }

  if (! cartItems || ! cartItems.length) {
    return (
      <>
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">No data</h1>
        </div>
      </>
    )
  }

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
            {cartItems.map((cartItem) => (
              <TableRow key={cartItem.id}>
                <TableCell className="flex items-center gap-3">
                  <img src={"https://avatar.vercel.sh/shadcn1"} alt={cartItem.product.name} className="w-12 h-12 rounded-md object-cover grayscale" />
                  <div>
                    <span className="block">{cartItem.product.name}</span>
                    <span className="text-xs text-gray-400">{cartItem.categoryId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={cartItem.qty}
                    onChange={(e) => handleQtyUpdate(cartItem.id, e.target.value)}
                    className="w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-right">Rp {cartItem.price * cartItem.qty}</TableCell>
                <TableCell className="text-right">
                  <Button className="bg-red-500 text-white" onClick={() => handleRemove(cartItem.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rp {total}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="bg-black text-white" onClick={() => navigate('/checkout')}>Checkout</Button>
      </CardFooter>
    </Card>
  )
}
