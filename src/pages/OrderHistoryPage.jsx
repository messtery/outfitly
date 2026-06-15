import OrderHistory from "@/components/order/OrderHistory"
import { useEffect, useState } from "react"

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('http://localhost:3000/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
        },
      });
      const json = await res.json();
      setOrders(json.data);
    }
    fetchOrders()
  }, [])

  return (
    <div className="max-w-md mx-auto p-4">
      <OrderHistory orders={orders} />
    </div>
  )
}
