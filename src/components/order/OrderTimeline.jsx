import { CheckCircle2, Circle, Loader2 } from "lucide-react"

const steps = [
  {
    key: "received",
    label: "Order Received",
    description: "Your order has been placed and received by the canteen.",
  },
  {
    key: "processing",
    label: "Being Prepared",
    description: "The kitchen is preparing your food.",
  },
  {
    key: "ready",
    label: "Ready for Pickup",
    description: "Your order is ready. Please come to the counter.",
  },
  {
    key: "completed",
    label: "Completed",
    description: "Order has been picked up. Enjoy your meal!",
  },
]

export default function OrderTimeline({ currentStatus }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus)

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isDone = index < currentIndex
        const isActive = index === currentIndex
        const isUpcoming = index > currentIndex
        const isLast = index === steps.length - 1

        return (
          <div key={step.key} className="flex gap-3.5">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              ) : isActive ? (
                <div className="relative h-5 w-5 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="w-3 h-3 rounded-full bg-primary" />
                </div>
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground/30" />
              )}
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 my-1.5 rounded-full ${
                    isDone ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-semibold leading-5 ${
                  isUpcoming ? "text-muted-foreground/50" : "text-foreground"
                }`}
              >
                {step.label}
              </p>
              <p
                className={`text-xs mt-0.5 leading-relaxed ${
                  isUpcoming
                    ? "text-muted-foreground/40"
                    : "text-muted-foreground"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
