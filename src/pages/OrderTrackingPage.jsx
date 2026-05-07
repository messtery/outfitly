import OrderTimeline from "@/components/order/OrderTimeline"
import OrderDetails from "@/components/order/OrderDetails"
import OrderActions from "@/components/order/OrderActions"
import OrderEstimate from "@/components/order/OrderEstimate"
import AIChatFAB from "@/components/AIChatFAB"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOrder(res.data)
      })
  }, [])

  if (!order) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <OrderTimeline currentStatus={'received'} />
      <OrderEstimate minutes={order.estimatedTime} />
      <OrderDetails items={order.items} />
      <OrderActions
        onCancel={() => console.log("Pesanan dibatalkan")}
        onRepeat={() => console.log("Repeat order")}
      />
      <AIChatFAB />
    </div>
  )
}
