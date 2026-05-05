import OrderHistory from "@/components/order/OrderHistory"
import AIChatFAB from "@/components/AIChatFAB"

export default function OrderHistoryPage() {
  const orders = [
    {
      id: "101",
      status: "completed",
      date: "2026-04-20T14:30:00",
      items: [
        { name: "Nasi Goreng", qty: 1, price: 15000},
        { name: "Es Teh", qty: 2, price: 5000},
      ],
    },
    {
      id: "102",
      status: "processing",
      date: "2026-04-25T12:00:00",
      items: [
        { name: "Mie Ayam", qty: 1, price: 12000},
        { name: "Jus Jeruk", qty: 1, price: 10000},
      ],
    },
  ]

  return (
    <div className="max-w-md mx-auto p-4">
      <OrderHistory orders={orders} />
      <AIChatFAB />
    </div>
  )
}
