import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cartService } from "@/services/cartService"
import {
  Banknote, CreditCard, QrCode,
  ChevronRight, ClipboardList, RotateCcw,
} from "lucide-react"

const paymentStatusConfig = {
  pending: {
    label: "Pending",
    className: "border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700",
  },
  paid: {
    label: "Paid",
    className: "border-green-500 text-green-700 bg-green-50 dark:bg-green-950/40 dark:text-green-300 dark:border-green-700",
  },
  failed: {
    label: "Failed",
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

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ProductAvatar({ src, name, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-10 text-base"
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-xl object-cover flex-shrink-0`}
      />
    )
  }
  return (
    <div className={`${sizeClass} rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}>
      <span className="text-primary font-bold leading-none">
        {name?.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

function OrderCard({ order }) {
  const navigate = useNavigate()
  const [repeating, setRepeating] = useState(false)

  const statusCfg = paymentStatusConfig[order.paymentStatus] ?? paymentStatusConfig.pending
  const methodCfg = paymentMethodConfig[order.paymentMethod] ?? paymentMethodConfig.cash
  const MethodIcon = methodCfg.icon

  const total = order.items?.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0) ?? 0
  const itemCount = order.items?.length ?? 0
  const previewItems = order.items?.slice(0, 4) ?? []
  const overflow = itemCount - 4

  const itemSummary = order.items
    ?.slice(0, 2)
    .map((i) => i.product?.name)
    .filter(Boolean)
    .join(", ")

  const handleRepeat = async () => {
    setRepeating(true)
    try {
      await cartService.clearCart()
      await Promise.all(
        order.items.map((item) => cartService.addToCartWithQty(item.productId, item.qty))
      )
      navigate("/cart")
    } finally {
      setRepeating(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => navigate(`/orders/${order.id}`)}
      >
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Order</p>
          <p className="text-lg font-bold tracking-tight">#{order.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${statusCfg.className} text-xs font-semibold`}>
            {statusCfg.label}
          </Badge>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <Separator />

      {/* Meta row */}
      <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-muted-foreground">
        <span>{formatDate(order.createdAt)}</span>
        <span>·</span>
        <span>{formatTime(order.createdAt)}</span>
        <span>·</span>
        <div className="flex items-center gap-1">
          <MethodIcon className="w-3 h-3" />
          <span>{methodCfg.label}</span>
        </div>
      </div>

      <Separator />

      {/* Items preview */}
      <div className="px-4 py-3 space-y-2.5">
        {/* Avatar row */}
        <div className="flex items-center gap-1.5">
          {previewItems.map((item, idx) => (
            <ProductAvatar key={idx} src={item.product?.image} name={item.product?.name} size="sm" />
          ))}
          {overflow > 0 && (
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
              <span className="text-xs font-semibold text-muted-foreground">+{overflow}</span>
            </div>
          )}
        </div>

        {/* Item names summary */}
        <p className="text-sm text-muted-foreground leading-snug line-clamp-1">
          {itemSummary}
          {itemCount > 2 ? ` +${itemCount - 2} more` : ""}
        </p>
      </div>

      <Separator />

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-base font-bold text-primary">{formatCurrency(total)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            disabled={repeating}
            onClick={handleRepeat}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            {repeating ? "Adding..." : "Reorder"}
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <div>
        <p className="font-semibold text-foreground">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-1">Your order history will appear here</p>
      </div>
      <Button onClick={() => navigate("/")}>Browse Menu</Button>
    </div>
  )
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:3000/api/orders", {
      headers: { Authorization: `Bearer ${localStorage.token}` },
    })
      .then((res) => res.json())
      .then((json) => setOrders(json.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-10">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          {!loading && orders.length > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border bg-card h-40 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
