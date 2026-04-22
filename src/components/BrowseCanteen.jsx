import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const menuData = [
  { id: 1, name: "Nasi Goreng", category: "Makanan", price: 15000 },
  { id: 2, name: "Mie Ayam", category: "Makanan", price: 12000 },
  { id: 3, name: "Es Teh", category: "Minuman", price: 5000 },
  { id: 4, name: "Jus Alpukat", category: "Minuman", price: 10000 },
  { id: 5, name: "Ayam Geprek", category: "Makanan", price: 18000 },
];

export default function CanteenMenu() {
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
          <Card key={item.id} className="rounded-2xl shadow-md">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="mt-2 font-bold">Rp {item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
