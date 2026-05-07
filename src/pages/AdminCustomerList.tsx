import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/AdminSidebar"
import { useEffect, useState } from "react"

type Customer = {
  id: number
  email: string
  name: string
}

export default function AdminCustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/admin/customers")
      .then((res) => res.json())
      .then((res) => {
        setCustomers(res.data)
      })
  }, [])
  
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AdminSidebar currentPage="customers" />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2 font-medium">#</th>
                    <th className="p-2 font-medium">Email</th>
                    <th className="p-2 font-medium">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b last:border-b-0">
                      <td className="p-2">{customer.id}</td>
                      <td className="p-2">{customer.email}</td>
                      <td className="p-2">{customer.name}</td>
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
