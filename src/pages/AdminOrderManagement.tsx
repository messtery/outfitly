import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminSidebar from "@/components/AdminSidebar"
import type { Order, OrderItem, PaymentStatus } from "@/types/order"
import { paymentStatusColors } from "@/types/order"
import { initialOrders } from "@/data/orders"

const paymentStatusOptions: PaymentStatus[] = [
  "Paid",
  "Pending",
  "Failed",
  "Refunded",
]

const selectFieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"

type FormItem = {
  productName: string
  quantity: string
  price: string
}

export default function AdminOrderManagement() {
  // const navigate = useNavigate()
  // const [orders, setOrders] = useState<Order[]>(initialOrders)
  // const nextOrderNumber = useRef(
  //   initialOrders.length
  //     ? Math.max(
  //         0,
  //         ...initialOrders.map((o) => {
  //           const num = parseInt(o.id.replace("ORD-", ""), 10)
  //           return Number.isNaN(num) ? 0 : num
  //         })
  //       ) + 1
  //     : 1
  // )

  // const [customerName, setCustomerName] = useState("")
  // const [phone, setPhone] = useState("")
  // const [shippingAddress, setShippingAddress] = useState("")
  // const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("")
  // const [formItems, setFormItems] = useState<FormItem[]>([
  //   { productName: "", quantity: "", price: "" },
  // ])
  // const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  // const [errorMessage, setErrorMessage] = useState("")

  // const resetForm = () => {
  //   setCustomerName("")
  //   setPhone("")
  //   setShippingAddress("")
  //   setPaymentStatus("")
  //   setFormItems([{ productName: "", quantity: "", price: "" }])
  //   setEditingOrderId(null)
  //   setErrorMessage("")
  // }

  // const buildOrderItems = (items: FormItem[]): OrderItem[] =>
  //   items
  //     .filter(
  //       (item) =>
  //         item.productName.trim() &&
  //         Number(item.quantity) > 0 &&
  //         Number(item.price) > 0
  //     )
  //     .map((item, index) => ({
  //       id: index + 1,
  //       productName: item.productName.trim(),
  //       quantity: Number(item.quantity),
  //       price: Number(item.price),
  //     }))

  // const calculateTotal = (items: OrderItem[]) =>
  //   items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()

  //   if (
  //     !customerName.trim() ||
  //     !phone.trim() ||
  //     !shippingAddress.trim() ||
  //     !paymentStatus
  //   ) {
  //     setErrorMessage("Please fill all required fields.")
  //     return
  //   }

  //   const orderItems = buildOrderItems(formItems)
  //   if (orderItems.length === 0) {
  //     setErrorMessage("Please add at least one valid item.")
  //     return
  //   }

  //   const total = calculateTotal(orderItems)

  //   if (editingOrderId === null) {
  //     const newOrder: Order = {
  //       id: `ORD-${String(nextOrderNumber.current).padStart(3, "0")}`,
  //       customerName: customerName.trim(),
  //       phone: phone.trim(),
  //       shippingAddress: shippingAddress.trim(),
  //       total,
  //       paymentStatus: paymentStatus as PaymentStatus,
  //       date: new Date().toISOString().split("T")[0],
  //       items: orderItems,
  //     }
  //     setOrders((prev) => [...prev, newOrder])
  //     nextOrderNumber.current += 1
  //     resetForm()
  //     return
  //   }

  //   setOrders((prev) =>
  //     prev.map((order) =>
  //       order.id === editingOrderId
  //         ? {
  //             ...order,
  //             customerName: customerName.trim(),
  //             phone: phone.trim(),
  //             shippingAddress: shippingAddress.trim(),
  //             total,
  //             paymentStatus: paymentStatus as PaymentStatus,
  //             items: orderItems,
  //           }
  //         : order
  //     )
  //   )
  //   resetForm()
  // }

  // const handleEdit = (order: Order) => {
  //   setCustomerName(order.customerName)
  //   setPhone(order.phone)
  //   setShippingAddress(order.shippingAddress)
  //   setPaymentStatus(order.paymentStatus)
  //   setFormItems(
  //     order.items.map((item) => ({
  //       productName: item.productName,
  //       quantity: String(item.quantity),
  //       price: String(item.price),
  //     }))
  //   )
  //   setEditingOrderId(order.id)
  //   setErrorMessage("")
  // }

  // const handleDelete = (id: string) => {
  //   setOrders((prev) => prev.filter((order) => order.id !== id))
  //   if (editingOrderId === id) {
  //     resetForm()
  //   }
  // }

  // const handleViewDetail = (order: Order) => {
  //   navigate(`/admin/orders/${order.id}`, { state: { order } })
  // }

  // const addFormItem = () => {
  //   setFormItems((prev) => [
  //     ...prev,
  //     { productName: "", quantity: "", price: "" },
  //   ])
  // }

  // const removeFormItem = (index: number) => {
  //   setFormItems((prev) => prev.filter((_, i) => i !== index))
  // }

  // const updateFormItem = (
  //   index: number,
  //   field: keyof FormItem,
  //   value: string
  // ) => {
  //   setFormItems((prev) =>
  //     prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
  //   )
  // }

    const [orders, setOrder] = useState<Order[]>([])
  
    useEffect(() => {
      fetch("http://localhost:3000/admin/orders")
        .then((res) => res.json())
        .then((res) => {
          setOrder(res.data)
        })
    }, [])

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AdminSidebar currentPage="orders" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">Order ID</th>
                    <th className="p-2 font-medium">Customer Name</th>
                    <th className="p-2 font-medium">Total</th>
                    <th className="p-2 font-medium">Payment Status</th>
                    {/* <th className="p-2 font-medium">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="p-2">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20 ring-inset">
                          #{order.id}
                        </span>
                      </td>
                      <td className="p-2">{order.customer.name}</td>
                      <td className="p-2 text-right">
                        Rp {order.total.toLocaleString("id-ID")}
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[order.paymentStatus]}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      {/* <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(order)}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(order)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
