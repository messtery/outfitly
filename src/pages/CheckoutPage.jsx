import Checkout from "../components/Checkout"
import PaymentMethod from "../components/PaymentMethod"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <Checkout />
          <PaymentMethod />
        </div>
      </div>
    </div>
  )
}
