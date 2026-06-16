import OrderTimeline from "@/components/order/OrderTimeline"
import OrderDetails from "@/components/order/OrderDetails"
import OrderActions from "@/components/order/OrderActions"
import OrderEstimate from "@/components/order/OrderEstimate"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, RefreshCw } from "lucide-react"

const paymentStatusConfig = {
  pending: { label: "Pending Payment", variant: "outline" },
  paid: { label: "Paid", variant: "default" },
  failed: { label: "Payment Failed", variant: "destructive" },
}

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  const fetchOrder = () => {
    return fetch(`http://localhost:3000/api/orders/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.token}` },
    })
      .then((res) => res.json())
      .then((res) => setOrder(res.data))
  }

  useEffect(() => {
    fetchOrder()
  }, [])

  const checkPaymentStatus = async () => {
    setCheckingStatus(true)
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}/payment-status`, {
        headers: { 'Authorization': `Bearer ${localStorage.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setOrder((prev) => ({ ...prev, paymentStatus: data.data.paymentStatus }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCheckingStatus(false)
    }
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const statusCfg = paymentStatusConfig[order.paymentStatus] ?? paymentStatusConfig.pending

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Order #{order.id}</h1>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </div>

      {order.paymentStatus === 'pending' && !order.invoiceUrl && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium">Waiting for payment confirmation</p>
          <p className="text-xs text-muted-foreground mt-1">
            Please pay at the cashier. The admin will confirm your payment.
          </p>
        </div>
      )}

      {order.paymentStatus === 'pending' && order.invoiceUrl && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Complete your payment to confirm your order.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(order.invoiceUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Payment Page
            </Button>
            <Button
              size="sm"
              className="flex-1"
              disabled={checkingStatus}
              onClick={checkPaymentStatus}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${checkingStatus ? 'animate-spin' : ''}`} />
              {checkingStatus ? 'Checking...' : 'Check Payment Status'}
            </Button>
          </div>
        </div>
      )}

      {order.paymentStatus === 'paid' && (
        <OrderTimeline currentStatus={'received'} />
      )}

      <OrderEstimate minutes={order.estimatedTime} />
      <OrderDetails items={order.items} />
      <OrderActions
        onCancel={() => console.log("Pesanan dibatalkan")}
        onRepeat={() => console.log("Repeat order")}
      />
    </div>
  )
}
