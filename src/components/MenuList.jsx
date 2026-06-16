"use client"

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner"
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
import { cartService } from "../services/CartService";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

export default function MenuList() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 400);

  const fetchCategories = () => {
    fetch('http://localhost:3000/api/categories?limit=50')
      .then((res) => res.json())
      .then((res) => setCategories(res.data))
  }

  const fetchProducts = () => {
    const params = new URLSearchParams({ limit: '100' });
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (selectedCategoryId !== null) params.set('categoryId', selectedCategoryId);

    setLoading(true);
    fetch(`http://localhost:3000/api/products?${params}`)
      .then((res) => res.json())
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false))
  }

  const handleAddToCart = (productId) => {
    cartService.addToCart(productId).then(() => {
      toast.success("Item added to cart", {
        description: "Check your cart for more details",
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart")
        }
      })
    })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [debouncedSearch, selectedCategoryId])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Canteen Menu</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategoryId === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategoryId(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategoryId === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategoryId(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : !products.length ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <p className="text-lg font-semibold">No items found</p>
          <p className="text-sm text-muted-foreground">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="relative mx-auto w-full max-w-sm pt-0">
              <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
              <img
                src={product.image || '/placeholder-product.svg'}
                alt={product.name}
                className="relative z-20 aspect-video w-full object-cover brightness-90"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">Rp {Number(product.price).toLocaleString()}</Badge>
                </CardAction>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                  <p className="line-clamp-2">{product.description}</p>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => handleAddToCart(product.id)}>Add To Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
