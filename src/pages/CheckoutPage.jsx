import Checkout from "../components/Checkout"
import PaymentMethod from "../components/PaymentMethod"

export default function CheckoutPage() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Checkout />
      <PaymentMethod />
    </div>
  )
}
