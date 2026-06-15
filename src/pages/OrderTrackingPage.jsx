import OrderTimeline from "@/components/order/OrderTimeline"
import OrderDetails from "@/components/order/OrderDetails"
import OrderActions from "@/components/order/OrderActions"
import OrderEstimate from "@/components/order/OrderEstimate"
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
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading...</p>
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
    </div>
  )
}
