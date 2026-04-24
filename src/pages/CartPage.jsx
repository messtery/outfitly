import Cart from "../components/Cart"
import { useCart } from "../components/CartContext"

export default function CartPage() {
    const {cart, setCart} = useCart()
    return (
        <div className="min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
            <Cart cart={cart} setCart={setCart} />
        </div>
    )
}