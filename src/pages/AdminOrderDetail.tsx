import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Order, PaymentStatus } from "@/types/order"

const paymentStatusColors: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}

function AdminSidebar() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Manage your data</CardDescription>
      </CardHeader>
      <CardContent>
        <nav aria-label="Admin sidebar" className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <a href="/admin/products">Products</a>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <a href="/admin/categories">Categories</a>
          </Button>
          <Button asChild variant="secondary" className="w-full justify-start">
            <a href="/admin/orders" aria-current="page">
              Orders
            </a>
          </Button>
        </nav>
      </CardContent>
    </Card>
  )
}

export default function AdminOrderDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order as Order | undefined

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <AdminSidebar />
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Order not found.</p>
              <Button className="mt-4" onClick={() => navigate("/admin/orders")}>
                ← Back to Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AdminSidebar />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/admin/orders")}>
              ← Back
            </Button>
            <h1 className="text-xl font-semibold">Order Detail</h1>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle>Order Information</CardTitle>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                  {order.id}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <dt className="font-medium text-muted-foreground">Customer Name</dt>
                  <dd className="mt-1">{order.customerName}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Phone</dt>
                  <dd className="mt-1">{order.phone}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="font-medium text-muted-foreground">Shipping Address</dt>
                  <dd className="mt-1">{order.shippingAddress}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Order Date</dt>
                  <dd className="mt-1">{order.date}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Payment Status</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Total</dt>
                  <dd className="mt-1 font-semibold">
                    Rp {order.total.toLocaleString("id-ID")}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ordered Items</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">#</th>
                    <th className="p-2 font-medium">Product Name</th>
                    <th className="p-2 font-medium">Price</th>
                    <th className="p-2 font-medium">Qty</th>
                    <th className="p-2 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2">Rp {item.price.toLocaleString("id-ID")}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={4} className="p-2 text-right font-semibold">
                      Total
                    </td>
                    <td className="p-2 font-semibold">
                      Rp {order.total.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
