import React, { useState } from "react";
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

const menuData = [
  {
    id: 1,
    name: "Nasi Goreng",
    category: "Makanan",
    price: 15000,
    description: "Nasi goreng spesial dengan telur, ayam, dan bumbu khas."
  },
  {
    id: 2,
    name: "Mie Ayam",
    category: "Makanan",
    price: 12000,
    description: "Mie ayam gurih dengan topping ayam berbumbu dan sayuran segar."
  },
  {
    id: 3,
    name: "Es Teh",
    category: "Minuman",
    price: 5000,
    description: "Teh manis dingin yang menyegarkan."
  },
  {
    id: 4,
    name: "Jus Alpukat",
    category: "Minuman",
    price: 10000,
    description: "Jus alpukat creamy dengan rasa manis yang lezat."
  },
  {
    id: 5,
    name: "Ayam Geprek",
    category: "Makanan",
    price: 18000,
    description: "Ayam crispy geprek dengan sambal pedas dan nasi hangat."
  },
];

export default function MenuList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredMenu = menuData.filter((item) => {
    return (
      (category === "All" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });

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
        {filteredMenu.map((item) => (
          <Card className="relative mx-auto w-full max-w-sm pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
              src="https://avatar.vercel.sh/shadcn1"
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">{item.price}</Badge>
              </CardAction>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription title={item.description}>
                <p class="line-clamp-2">
                  {item.description}
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={() => alert('item added')}>Add To Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
