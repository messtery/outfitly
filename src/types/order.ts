export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded"

export type OrderItem = {
  id: number
  productName: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  customerName: string
  phone: string
  shippingAddress: string
  total: number
  paymentStatus: PaymentStatus
  date: string
  time?: string
  items: OrderItem[]
}

export const paymentStatusColors: Record<PaymentStatus, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  Refunded: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
}
