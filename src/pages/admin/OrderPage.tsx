import { useEffect, useState } from "react"
import { DataTable } from "./orders/DataTable"
import { columns } from "./orders/columns"

type Order = {
  id: string
  customer: {
    name: string
  }
  total: number
  paymentStatus: "paid" | "pending" | "failed"
}

export default function OrderPage() {
  const [orders, setOrder] = useState<Order[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/admin/orders")
      .then((res) => res.json())
      .then((res) => {
        setOrder(res.data)
      })
  }, [])

  return (
    <div className="mx-auto w-full p-6">
      <DataTable columns={columns} data={orders}/>
    </div>
  )
}
