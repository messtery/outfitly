import Checkout from "../components/Checkout"
import { useCart } from "../components/CartContext"

export default function CheckoutPage() {
    const { cart } = useCart()
    return (
        <div className="min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <Checkout cart={cart}/>
        </div>
    )
}