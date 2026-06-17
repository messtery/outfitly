"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, ShoppingCartIcon, UsersIcon, ClockIcon } from "lucide-react"
import { adminFetch } from "@/lib/adminFetch"

const API = "http://localhost:3000/api"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  pendingOrders: number
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SectionCards() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    adminFetch(`${API}/admin/dashboard/stats`)
      .then((r) => r.json())
      .then((json) => setStats(json.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const skeleton = "animate-pulse bg-muted rounded h-8 w-32"

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <div className={skeleton} /> : formatRupiah(stats?.totalRevenue ?? 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="text-primary" />
              Paid orders
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue from completed payments
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <div className={skeleton} /> : (stats?.totalOrders ?? 0).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ShoppingCartIcon className="text-primary" />
              All orders
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders placed across all statuses
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <div className={skeleton} /> : (stats?.totalCustomers ?? 0).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <UsersIcon className="text-primary" />
              Registered
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered customer accounts
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <div className={skeleton} /> : (stats?.pendingOrders ?? 0).toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ClockIcon className="text-primary" />
              Awaiting payment
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Orders waiting for payment
          </div>
          <div className="text-muted-foreground">Requires attention</div>
        </CardFooter>
      </Card>
    </div>
  )
}
