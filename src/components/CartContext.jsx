import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([
    { id: 1, name: "Nasi Goreng", category: "Makanan", price: 15000, qty: 1, image: "/images/nasi-goreng.jpg" },
    { id: 2, name: "Es Teh", category: "Minuman", price: 5000, qty: 2, image: "/images/es-teh.jpg" },
    { id: 3, name: "Ayam Geprek", category: "Makanan", price: 18000, qty: 1, image: "/images/ayam-geprek.jpg" },
  ])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
