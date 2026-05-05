import Checkout from "../components/Checkout"
import PaymentMethod from "../components/PaymentMethod"
import AIChatFAB from "../components/AIChatFAB"

export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg ">
                <h1 className="text-2xl font-bold text-center">Checkout</h1>
                <Checkout/>
                <PaymentMethod />
            </div>
            <AIChatFAB />
        </div>
    )
}