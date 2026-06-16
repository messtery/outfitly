import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import OrderItem from "./OrderItem"
import OrderActions from "./OrderActions"

export default function OrderHistory({ orders, onRepeat }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <Badge variant="outline">{order.paymentStatus}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString()}
          </p>

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
            <OrderActions mode="history" items={order.items} />
          </div>

        </Card>
      ))}
    </div>
  )
}
