import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/AdminSidebar"

type Customer = {
  id: number
  email: string
  totalOrders: number
}

const initialCustomers: Customer[] = [
  { id: 1, email: "alice.johnson@example.com", totalOrders: 3 },
  { id: 2, email: "bob.smith@example.com", totalOrders: 1 },
  { id: 3, email: "carol.white@example.com", totalOrders: 2 },
  { id: 4, email: "david.brown@example.com", totalOrders: 1 },
]

export default function AdminCustomerList() {
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
                    <th className="p-2 font-medium">Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {initialCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b last:border-b-0">
                      <td className="p-2">{customer.id}</td>
                      <td className="p-2">{customer.email}</td>
                      <td className="p-2">{customer.totalOrders}</td>
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
