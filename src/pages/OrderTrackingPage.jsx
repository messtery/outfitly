import OrderTimeline from "@/components/order/OrderTimeline"
import OrderDetails from "@/components/order/OrderDetails"
import OrderActions from "@/components/order/OrderActions"
import OrderEstimate from "@/components/order/OrderEstimate"

export default function OrderTrackingPage() {
  const order = {
    status: "received",
    estimatedTime: 10,
    details: [
      { name: "Nasi Goreng", qty: 1 },
      { name: "Es Teh", qty: 2 },
    ],
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <OrderTimeline currentStatus={order.status} />
      <OrderEstimate minutes={order.estimatedTime} />
      <OrderDetails items={order.details} />
      <OrderActions
        onCancel={() => console.log("Pesanan dibatalkan")}
        onRepeat={() => console.log("Repeat order")}
      />
    </div>
  )
}
