import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/AdminSidebar"
import type { PaymentStatus } from "@/types/order"
import { paymentStatusColors } from "@/types/order"
import { initialOrders } from "@/data/orders"

const statusConfig: { status: PaymentStatus; label: string }[] = [
  { status: "Paid", label: "Paid" },
  { status: "Pending", label: "Pending" },
  { status: "Failed", label: "Failed" },
  { status: "Refunded", label: "Refunded" },
]

function buildHourlyData(
  orders: typeof initialOrders
): { hour: number; count: number }[] {
  const counts: Record<number, number> = {}
  for (let h = 0; h < 24; h++) counts[h] = 0
  for (const order of orders) {
    if (order.time) {
      const hour = parseInt(order.time.split(":")[0], 10)
      if (!Number.isNaN(hour) && hour >= 0 && hour < 24) {
        counts[hour] += 1
      }
    }
  }
  return Object.entries(counts).map(([h, count]) => ({
    hour: Number(h),
    count,
  }))
}

export default function AdminDashboard() {
  const orders = initialOrders

  const statusCounts = statusConfig.map(({ status, label }) => ({
    status,
    label,
    count: orders.filter((o) => o.paymentStatus === status).length,
  }))

  const hourlyData = buildHourlyData(orders)
  const maxCount = Math.max(...hourlyData.map((d) => d.count), 1)

  const chartHeight = 180
  const xAxisHeight = 20
  const countLabelHeight = 14
  const barAreaHeight = chartHeight - xAxisHeight - countLabelHeight
  const barWidth = 14
  const barGap = 4
  const yAxisWidth = 28
  const barsWidth = hourlyData.length * (barWidth + barGap) - barGap
  const chartWidth = yAxisWidth + barsWidth

  // Y-axis ticks: 0, midpoint, max
  const yTicks = Array.from(
    new Set([0, Math.round(maxCount / 2), maxCount])
  ).sort((a, b) => a - b)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <AdminSidebar currentPage="dashboard" />

        <div className="space-y-6">
          {/* Order Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {statusCounts.map(({ status, label, count }) => (
                  <div
                    key={status}
                    className={`flex items-center justify-between gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${paymentStatusColors[status]}`}
                  >
                    <span>{label}</span>
                    <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs font-bold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hour Insight */}
          <Card>
            <CardHeader>
              <CardTitle>Peak Hour Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Total orders placed per hour of the day
              </p>
              <div className="overflow-x-auto">
                <svg
                  width={chartWidth}
                  height={chartHeight}
                  aria-label="Orders per hour bar chart"
                  role="img"
                  className="min-w-full"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  style={{ width: "100%", height: "auto" }}
                >
                  {/* Y-axis gridlines and labels */}
                  {yTicks.map((tick) => {
                    const tickY =
                      countLabelHeight +
                      barAreaHeight -
                      (tick / maxCount) * barAreaHeight
                    return (
                      <g key={tick}>
                        <line
                          x1={yAxisWidth}
                          y1={tickY}
                          x2={chartWidth}
                          y2={tickY}
                          stroke="currentColor"
                          strokeOpacity={0.1}
                          strokeWidth={1}
                        />
                        <text
                          x={yAxisWidth - 4}
                          y={tickY + 3}
                          textAnchor="end"
                          fontSize={8}
                          className="fill-muted-foreground"
                        >
                          {tick}
                        </text>
                      </g>
                    )
                  })}

                  {/* Bars */}
                  {hourlyData.map(({ hour, count }) => {
                    const x = yAxisWidth + hour * (barWidth + barGap)
                    const barH =
                      count === 0 ? 2 : (count / maxCount) * barAreaHeight
                    const barY = countLabelHeight + barAreaHeight - barH
                    return (
                      <g key={hour}>
                        <rect
                          x={x}
                          y={barY}
                          width={barWidth}
                          height={barH}
                          rx={2}
                          className={count > 0 ? "fill-primary" : "fill-muted"}
                        />
                        {/* Count label above bar */}
                        {count > 0 ? (
                          <text
                            x={x + barWidth / 2}
                            y={barY - 3}
                            textAnchor="middle"
                            fontSize={8}
                            fontWeight="600"
                            className="fill-foreground"
                          >
                            {count}
                          </text>
                        ) : null}
                        {/* Hour label on x-axis */}
                        <text
                          x={x + barWidth / 2}
                          y={chartHeight - 4}
                          textAnchor="middle"
                          fontSize={7}
                          className="fill-muted-foreground"
                        >
                          {hour}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Hour of day (0–23)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
