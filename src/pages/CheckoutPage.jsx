import Checkout from "../components/Checkout"

export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg ">
                <h1 className="text-2xl font-bold text-center">Checkout</h1>
                <Checkout />
            </div>
        </div>
    )
}