import OrderTimeline from "@/components/order/OrderTimeline"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ExternalLink, RefreshCw, ChevronLeft,
  Banknote, CreditCard, QrCode,
  Calendar, Clock, ShoppingBag,
} from "lucide-react"

const paymentStatusConfig = {
  pending: {
    label: "Pending Payment",
    className: "border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
  },
  paid: {
    label: "Paid",
    className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-300 dark:border-green-700",
  },
  failed: {
    label: "Payment Failed",
    className: "border-red-400 text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 dark:border-red-700",
  },
}

const paymentMethodConfig = {
  cash: { label: "Cash", icon: Banknote },
  qris: { label: "QRIS", icon: QrCode },
  transfer: { label: "Bank Transfer", icon: CreditCard },
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr)
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

function ProductAvatar({ src, name }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
      />
    )
  }
  return (
    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-primary font-bold text-xl">
        {name?.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export default function OrderTrackingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

  const fetchOrder = () => {
    return fetch(`http://localhost:3000/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.token}` },
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
      const res = await fetch(
        `http://localhost:3000/api/orders/${id}/payment-status`,
        { headers: { Authorization: `Bearer ${localStorage.token}` } }
      )
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
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <ShoppingBag className="w-10 h-10 text-muted-foreground/40 animate-pulse" />
        <p className="text-muted-foreground text-sm">Loading order...</p>
      </div>
    )
  }

  const statusCfg = paymentStatusConfig[order.paymentStatus] ?? paymentStatusConfig.pending
  const methodCfg = paymentMethodConfig[order.paymentMethod] ?? paymentMethodConfig.cash
  const MethodIcon = methodCfg.icon
  const { date, time } = order.createdAt ? formatDateTime(order.createdAt) : { date: "—", time: "—" }
  const itemCount = order.items?.length ?? 0
  const subtotal = order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) ?? order.total

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-10 space-y-4">
      {/* ── Order header card ── */}
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Order</p>
            <h1 className="text-3xl font-bold tracking-tight mt-0.5">#{order.id}</h1>
          </div>
          <Badge variant="outline" className={`${statusCfg.className} text-xs font-semibold px-3 py-1`}>
            {statusCfg.label}
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-xs leading-tight">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium text-xs leading-tight">{time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment card ── */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0 pt-4 px-5">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pt-3 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MethodIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{methodCfg.label}</p>
                <p className="text-xs text-muted-foreground">Payment method</p>
              </div>
            </div>
            <Badge variant="outline" className={`${statusCfg.className} text-xs font-semibold`}>
              {statusCfg.label}
            </Badge>
          </div>

          {order.paymentStatus === "pending" && !order.invoiceUrl && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                Waiting for cashier confirmation
              </p>
              <p className="text-xs text-amber-700/70 dark:text-amber-300/60 mt-0.5 leading-relaxed">
                Please pay at the counter. The admin will confirm your payment.
              </p>
            </div>
          )}

          {order.paymentStatus === "pending" && order.invoiceUrl && (
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(order.invoiceUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Pay Now
              </Button>
              <Button
                size="sm"
                className="flex-1"
                disabled={checkingStatus}
                onClick={checkPaymentStatus}
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 ${checkingStatus ? "animate-spin" : ""}`} />
                {checkingStatus ? "Checking..." : "Refresh"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Order status timeline (only when paid) ── */}
      {order.paymentStatus === "paid" && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-0 pt-4 px-5">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-4 pb-4">
            <OrderTimeline currentStatus={order.orderStatus ?? "received"} />
          </CardContent>
        </Card>
      )}

      {/* ── Items card ── */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Items
            </CardTitle>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-3 pb-4 space-y-4">
          {order.items?.map((item, idx) => (
            <div key={idx}>
              <div className="flex gap-3 items-start">
                <ProductAvatar src={item.product?.image} name={item.product?.name} />
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="font-semibold text-sm leading-snug">{item.product?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatCurrency(item.price)} each
                  </p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2.5 py-1">
                      × {item.qty}
                    </span>
                    <span className="text-sm font-bold">
                      {formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
              {idx < order.items.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}

          {/* Summary */}
          <div className="rounded-xl bg-muted/60 p-4 space-y-2 mt-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Cancel action ── */}
      {order.paymentStatus === "pending" && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => console.log("cancel")}
        >
          Cancel Order
        </Button>
      )}
    </div>
  )
}
