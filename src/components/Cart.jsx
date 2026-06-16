import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "./ui/separator"
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
    fetch('http://localhost:3000/api/cart-items', {
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
    fetch('http://localhost:3000/api/cart-items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({ customerId: 1, id, qty })
    })
      .then((res) => res.json())
      .then(() => fetchCartItems())
  }

  const deleteCartItem = async (id) => {
    await fetch(`http://localhost:3000/api/cart-items/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` },
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => fetchCartItems())
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!cartItems || !cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">Add some items to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
      {/* Left: item table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Item</TableCell>
                <TableCell className="font-semibold">Qty</TableCell>
                <TableCell className="font-semibold text-right">Price</TableCell>
                <TableCell />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((cartItem) => (
                <TableRow key={cartItem.id}>
                  <TableCell className="flex items-center gap-3">
                    <img
                      src={"https://avatar.vercel.sh/shadcn1"}
                      alt={cartItem.product.name}
                      className="w-12 h-12 rounded-md object-cover grayscale"
                    />
                    <div>
                      <span className="block font-medium">{cartItem.product.name}</span>
                      <span className="text-xs text-muted-foreground">Rp {Number(cartItem.price).toLocaleString()} / item</span>
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
                  <TableCell className="text-right font-medium">
                    Rp {(cartItem.price * cartItem.qty).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(cartItem.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Right: order summary */}
      <Card>
        <CardHeader className="pb-3">
          <h2 className="text-lg font-bold">Order Summary</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {cartItems.map((cartItem) => (
            <div key={cartItem.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{cartItem.qty}× {cartItem.product.name}</span>
              <span>Rp {(cartItem.price * cartItem.qty).toLocaleString()}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
            Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
