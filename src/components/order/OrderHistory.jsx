import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import OrderItem from "./OrderItem"
import OrderActions from "./OrderActions"
import { useNavigate } from "react-router-dom"

export default function OrderHistory({ orders, onRepeat }) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <Badge variant="outline">{order.paymentStatus}</Badge>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{new Date(order.createdAt).toLocaleString()}</span>
            {order.paymentMethod && (
              <span className="capitalize">· {order.paymentMethod}</span>
            )}
          </div>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <OrderItem key={idx} item={item} />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">
              Total: Rp {order.items.reduce(
                (acc, item) => acc + Number(item.price) * Number(item.qty),
                0
              )}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                View Detail
              </Button>
              <OrderActions mode="history" items={order.items} />
            </div>
          </div>

        </Card>
      ))}
    </div>
  )
}
