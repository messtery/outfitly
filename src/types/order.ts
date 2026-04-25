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
  items: OrderItem[]
}
