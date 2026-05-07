import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function MenuList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch('http://localhost:3000/products')
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddToCart = (productId) => {
    fetch('http://localhost:3000/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: 1,
        productId,
        qty: 1,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        alert('Added to cart')
      })
  }

  useEffect(() => {
    fetchProducts()
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

  if (! products.length) {
    return (
      <>
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold">No data</h1>
        </div>
      </>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Canteen Menu</h1>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setCategory("All")}>All</Button>
        <Button onClick={() => setCategory("Makanan")}>Makanan</Button>
        <Button onClick={() => setCategory("Minuman")}>Minuman</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src="https://avatar.vercel.sh/shadcn1"
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">{product.price}</Badge>
              </CardAction>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription title={product.description}>
                <p className="line-clamp-2">
                  {product.description}
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart(product.id)}>Add To Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
